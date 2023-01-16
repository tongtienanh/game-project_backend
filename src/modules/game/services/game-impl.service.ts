import {Injectable} from '@nestjs/common';
import {CreateGameDto, DeleteGames} from '../dto/create-game.dto';
import {UpdateGameDto} from '../dto/update-game.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Game} from "../../../database/entities/game/game.entity";
import {JoinOptions, Repository} from "typeorm";
import {S3} from 'aws-sdk';
import 'dotenv/config';
import {CoreLoggerService} from "../../common/services/logger/base-logger.service";
import {ConvertNameImage} from "../../common/utils/convert-name-image";
import {Download, GameCategory, GameTag} from "../../../database/entities";
import {PaginationInterface, ResponseEntity} from "../../../common/resources/base/response.entity";
import {GameRequest} from "../dto/game.request";
import {gameCategories, gameTags, IMAGES, optionGame, TYPE_GOOGLE, TYPE_LINKS} from "../constants/game.constant";
import {pick} from 'lodash';
import sharp from "sharp";
import {LocalFileDto} from "../../users/dto/local-file.dto";

@Injectable()
export class GameImplService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(Download)
        private downloadRepository: Repository<Download>,
        @InjectRepository(GameTag)
        private gameTagRepository: Repository<GameTag>,
    ) {
    }

    private readonly logger = new CoreLoggerService(GameImplService.name)

    async upload(file: LocalFileDto) {
        const dataS3 = await this.sharpFunction(file)
        return new ResponseEntity<any>(dataS3);
        // return dataS3;

        // let {originalname} = file;
        // const splitName = originalname.split('.');
        // const typeImage = splitName[splitName?.length - 1];
        // originalname = ConvertNameImage.toSlug(splitName[0]) + '.' + typeImage;
        // this.logger.debug("originalname:", originalname)
        // const bucketS3 = "image-game";
        // const dataS3 = await this.uploadS3(file.buffer, bucketS3, originalname);
        //
        // return new ResponseEntity<any>(dataS3);
    }

    async uploadS3(file, bucket, originalname) {
        // Load the AWS SDK for Node.js
        var AWS = require('aws-sdk');
// Set the region
        AWS.config.update({region: 'ap-northeast-1'});

// Create S3 service object
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const params = {
            Bucket: bucket,
            Key: String(originalname),
            Body: file,
            ACL: "public-read"
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    this.logger.debug("err.message:", err)
                    reject(err.message);
                }
                this.logger.debug("data:", data)
                resolve(data);
            });
        });
// Create the parameters for calling createBucket
//     var bucketParams = {
//       Bucket : "image-96x128"
//     };
//
//
// // call S3 to create the bucket
//     s3.createBucket(bucketParams, function(err, data) {
//       if (err) {
//         console.log("Error", err);
//       } else {
//         console.log("Success", data.Location);
//       }
//     });
    }

    async createOrUpdate(request: CreateGameDto): Promise<boolean> {
        let entity = request.toEntity();
        if (request.gameId) {
            entity = await this.gameRepository.findOne({
                relations: ["gameTag", "download"],
                where: {
                    id: request.gameId
                }
            })
        }
        const links = this.storeLinkDownload(request);
        const tags = this.storeTags(request);
        const categories = this.storeCategory(request);
        entity.gameTag = tags;
        entity.download = links;
        entity.gameCategory = categories;
        await this.gameRepository.save(entity);

        return true;
    }

    storeLinkDownload(request: CreateGameDto): Download[] {
        if (!request?.links.length) return [];
        const arrLink = [];
        for (const link of request.links) {
            const linkDownload = new Download();
            linkDownload.type = link.type;
            linkDownload.link = link.url;
            linkDownload.createdAt = new Date();
            linkDownload.updatedAt = new Date();
            arrLink.push(linkDownload);
        }
        return arrLink;
    }

    storeTags(request: CreateGameDto): GameTag[] {
        if (!request.tags.length) return [];
        const tags = [];
        for (const tag of request.tags) {
            const entity = new GameTag();
            entity.tagId = tag;
            entity.createdAt = new Date();
            entity.updatedAt = new Date();
            tags.push(entity);
        }
        return tags;
    }

    storeCategory(request: CreateGameDto): GameCategory[] {
        if (!request.categories.length) return [];
        const categories = [];
        for (const category of request.categories) {
            const entity = new GameCategory();
            entity.categoryId = category;
            entity.createdAt = new Date();
            entity.updatedAt = new Date();
            categories.push(entity)
        }
        return categories;
    }

    async findAll(request: GameRequest) {
        const {page = 1, size = 20} = request;
        const skip = (page - 1) * size;
        const alias = Game.name;
        const queryParams = this.getGameFilter(request);
        const qb = await this.gameRepository.createQueryBuilder(alias)
            .innerJoinAndSelect(`${alias}.download`, 'download')
            .innerJoinAndSelect(`${alias}.gameTag`, 'gameTag')
            .innerJoinAndSelect(`${alias}.gameCategory`, 'gameCategory')
            .where(queryParams.whereParam.join('AND'), queryParams.replacement)
            .limit(size)
            .offset(skip)
            .getManyAndCount()
        const result = qb[0].map((item) => {
            const iGameTags = item.gameTag.map((iGameTag) => {
                iGameTag["name"] = gameTags[iGameTag.tagId];
                const tags = optionGame.find(iOption => iOption.id == iGameTag.tagId)

                return tags
            })
            const categories = item.gameCategory.map((iCategory) => {
                iCategory["name"] = gameCategories[iCategory.categoryId]
                return pick(iCategory, ['id', 'categoryId', 'name'])
            })
            const downloads = item.download.map((iDownload) => {
                return {
                    type: iDownload.type,
                    id: iDownload.id,
                    url: iDownload.link
                };
            })
            return {
                ...pick(item, ['id', 'image', 'description', 'content', 'name']),
                gameTag: iGameTags,
                gameCategory: categories,
                download: downloads
            }
        })
        const totalRecord = qb[1]
        const pagination: PaginationInterface = {
            totalElements: totalRecord,
            totalPages: Math.ceil(totalRecord / size),
            numberOfElements: qb[0].length,
            page,
            size
        }
        return new ResponseEntity(
            result,
            null,
            pagination
        );
    }

    getGameFilter(request: GameRequest) {
        let whereParam = [];
        let replacement = {}
        if (request.tags?.length) {
            whereParam.push(`gameTag.tag_id IN (:tags)`)
            replacement['tags'] = request.tags
        }
        if (request.categories?.length) {
            whereParam.push(`gameCategory.category_id IN (:tags)`)
            replacement['tags'] = request.tags
        }
        if (request?.search) {
            whereParam.push(`${Game.name}.name LIKE :name`);
            replacement['name'] = request.search + '%'
        }
        return {
            whereParam,
            replacement
        }
    }

    async remove(request: DeleteGames): Promise<ResponseEntity<boolean>> {
        for (const gameId of request.ids) {
            const game = await this.gameRepository.findOne({
                relations: ["download", "gameTag", "gameCategory"],
                where: {
                    id: gameId
                }
            })
            this.logger.debug("game:", game)
            const downloadIds = game.download.map(iDownload => iDownload.id)
            const categoryIds = game.gameCategory.map(iCategory => iCategory.id)
            const tagIds = game.gameTag.map(iTag => iTag.id)
            if (!game) throw new Error(`Game có id ${gameId} không tồn tại, vui lòng thử lại!`)
            await Promise.all([
                this.gameRepository.softDelete(game.id),
                this.downloadRepository.softDelete(downloadIds),
                this.gameRepository.softDelete(categoryIds),
                this.gameRepository.softDelete(tagIds),
            ])
        }
        return new ResponseEntity<boolean>(true);

    }

    findOne(id: number) {
        return `This action returns a #${id} game`;
    }

    update(id: number, updateGameDto: UpdateGameDto) {
        return `This action updates a #${id} game`;
    }

    async sharpFunction(fileData: LocalFileDto) {
        const sharp = require('sharp');
        const outputName = fileData.fileName.split(".")[0];
        const result = [];
        for (const image of IMAGES) {
            const imageBuffer = await sharp(fileData.path)
                .resize({
                    width: image.width,
                    height: image.height,
                    fit: sharp.fit.cover,
                })
                .toFormat('webp', { progressive: true, quality: 85 })
                .toBuffer()
            const bucketS3 = image.bucket;
            const response =  await this.uploadS3(imageBuffer, bucketS3, `${outputName}-${image.height}x${image.width}.webp`);
            result.push(response)
        }
        return result;
    }
}
