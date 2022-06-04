/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */

import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';

/**
 *
 * DTO for video 
 * @category DTOs
 * @class VideoDTO
 * @param {string} name - Name of video 
 * @param {string} path - path of video
 * @param {number} weight - weight of video
 * @param {Date} upload_at - upload_at of video 
 * @param {string} author - author of video 
 * @param {Array<String>} shared_users - shared_users of video 
 */
class VideoDTO {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public path: string;
    
    @IsNotEmpty()
    @IsNumber()
    public weight: number;

    @IsNotEmpty()
    @IsDate()
    public upload_at: Date;

    @IsNotEmpty()
    @IsString()
    public author: string;


    public shared_users: Array<String>;
    /**
   * Creates an instance of Video.
   * @param {string} videoname - the name video
   * @param {string} email - the email video
   * @param {string} password - the password video
   * @memberof Video
   */
    constructor(name: string, path: string, weight: number, upload_at: Date, author: string, shared_users: Array<String>) {
        this.name = name;
        this.path = path;
        this.weight = weight;
        this.upload_at = upload_at;
        this.author = author;
        this.shared_users = shared_users;
    }
}

export default VideoDTO;
