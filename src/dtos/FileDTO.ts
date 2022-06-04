/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */

import { IsString, IsNotEmpty, IsDate, IsNumber } from 'class-validator';

/**
 *
 * DTO for file 
 * @category DTOs
 * @class FileDTO
 * @param {string} name - Name of file 
 * @param {string} path - path of file
 * @param {number} weight - weight of file
 * @param {Date} upload_at - upload_at of file 
 * @param {string} author - author of file 
 * @param {Array<String>} shared_users - shared_users of file 
 */
class FileDTO {
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
   * Creates an instance of file.
   * @param {string} filename - the name file
   * @param {string} email - the email file
   * @param {string} password - the password file
   * @memberof file
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

export default FileDTO;
