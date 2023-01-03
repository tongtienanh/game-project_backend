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
import {Download, GameTag} from "../../../database/entities";

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
        await this.uploadS3(file.buffer, bucketS3, originalname)
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

    async create(request: CreateGameDto): Promise<boolean> {
        const entity = request.toEntity();

        await this.gameRepository.insert(entity);

        this.logger.debug(request);
        const gameId = entity.id;
        this.storeLinkDownload(gameId, request);
        this.storeTags(gameId, request);

        return true;
    }

    async storeLinkDownload(id, request: CreateGameDto): Promise<void> {
        const arrLink = [];
        for (const link of request.links) {
            const linkDownload = new Download();
            linkDownload.type = link.type;
            linkDownload.link = link.url;
            linkDownload.gameId = id;
            linkDownload.createdAt = new Date();
            linkDownload.updatedAt = new Date();
            arrLink.push(linkDownload);
        }
        await this.downloadRepository.insert(arrLink);
    }

    async storeTags(gameId, request: CreateGameDto): Promise<void> {
        await this.gameTagRepository.softDelete({gameId});
        const tags = [];
        for (const tag of request.tags) {
            const entity = new GameTag();
            entity.gameId = gameId;
            entity.tagId = tag;
            entity.createdAt = new Date();
            entity.updatedAt = new Date();
            tags.push(entity);
        }
        await this.gameTagRepository.insert(tags);
    }

    findAll() {
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
