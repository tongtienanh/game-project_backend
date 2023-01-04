import {Injectable} from '@nestjs/common';
import {CreateGameDto} from '../dto/create-game.dto';
import {UpdateGameDto} from '../dto/update-game.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Game} from "../../../database/entities/game/game.entity";
import {Repository} from "typeorm";
import {S3} from 'aws-sdk';
import 'dotenv/config';
import {CoreLoggerService} from "../../common/services/logger/base-logger.service";
import {ConvertNameImage} from "../../common/utils/convert-name-image";
import {Download, GameCategory, GameTag} from "../../../database/entities";
import {ResponseEntity} from "../../../common/resources/base/response.entity";
import {GameRequest} from "../dto/game.request";

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

    async upload(file) {
        let {originalname} = file;
        const splitName = originalname.split('.');
        const typeImage = splitName[splitName?.length - 1];
        originalname = ConvertNameImage.toSlug(splitName[0]) + '.' + typeImage;
        this.logger.debug("originalname:", originalname)
        const bucketS3 = "image-game";
        const dataS3 = await this.uploadS3(file.buffer, bucketS3, originalname);

        return new ResponseEntity<any>(dataS3);
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
// // Create the parameters for calling createBucket
//     var bucketParams = {
//       Bucket : "image-game"
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

    findAll(request: GameRequest) {

        return `This action returns all game`;
    }

    findOne(id: number) {
        return `This action returns a #${id} game`;
    }

    update(id: number, updateGameDto: UpdateGameDto) {
        return `This action updates a #${id} game`;
    }

    remove(id: number) {
        return `This action removes a #${id} game`;
    }
}
