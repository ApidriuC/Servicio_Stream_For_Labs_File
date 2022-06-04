/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { NextFunction, Response, Request } from 'express';
import { IConfig, IFile,IPhoto, IVideo} from '../interfaces';
import { Config, File, Photo, Video } from '../models';
import { HttpException } from '../exceptions';
import { FileService, PhotoService, VideoService } from '../services';
import fs from 'fs'
import path from 'path'
import { encryptAndSaveFile, encryptAndSaveVideo, decryptFile } from '../utils/encrypt'
const mkdirp = require('mkdirp')


/**
 *
 * The File controller
 * @category Controllers
 * @class FileController
 */
class FileController {
  
  /**
   *
   * List all Files
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of Files
   * @memberof FileController
   */
  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const author = req.params.author
      const ownFiles: Array<IFile> = await FileService.getFiles(author);
      const videos: Array<IVideo> = await VideoService.getVideos(author);
      const photos: Array<IPhoto> = await PhotoService.getPhotos(author);

      const allFiles = [...videos, ...photos,...ownFiles]
      res.json(allFiles)
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }

    /**
   *
   * Share File
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {Number} - A status request
   * @memberof FileController
   */
     public static async shareFileWithUser(req: Request, res: Response, next: NextFunction) {
      try {
        const {fileId, userToShareId} = req.body
        const { author} = req.params
        const fileShared: IFile | null = await  FileService.shareFileWithUser(userToShareId, fileId)
        
        if (!fileShared) throw new HttpException(404, 'File not found');
        if (author != fileShared?.author) throw new HttpException(403, 'Forbidden');
        
        res.sendStatus(200);
      } catch (error) {
        return next(new HttpException(error.status || 500, error.message));
      }
    }

    /**
   *
   * List all Files shared
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of Files shared
   * @memberof FileController
   */
     public static async listAllSharedFIles(req: Request, res: Response, next: NextFunction) {
      try {
        const author = req.params.author
        const files: Array<IFile> = await FileService.getShareFiles(author);
        const videos: Array<IVideo> = await VideoService.getShareVideos(author);
        const photos: Array<IPhoto> = await PhotoService.getSharePhotos(author);

        const allFiles = [...files, ...videos, ...photos]
        res.json(allFiles)
      } catch (error) {
        return next(new HttpException(error.status || 500, error.message));
      }
    }

  public static async mkdir(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.params.author
      const USER_FOLDER = `/home/streams-for-lab.co/${username?.toLowerCase().trim().replace(/ /g,'-')}`
      const FOLDER_OPTIONS ={mode: '700'}
      mkdirp.sync(`${USER_FOLDER}`, FOLDER_OPTIONS)
      mkdirp.sync(`${USER_FOLDER}/videos`, FOLDER_OPTIONS)
      mkdirp.sync(`${USER_FOLDER}/photos`, FOLDER_OPTIONS)
      mkdirp.sync(`${USER_FOLDER}/files`, FOLDER_OPTIONS)
      console.log(`Directories to ${username} was created`);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      
      return next(new HttpException(error.status || 500, error.message));
    }
  }

  
    /**
   *
   * get storage
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - Get storage
   * @memberof FileController
   */
  public static async getStorageByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const author = req.params.author
      const files: Array<IFile> = await FileService.getFiles(author);
      const photos: Array<IPhoto> = await PhotoService.getPhotos(author);
      const videos: Array<IVideo> = await VideoService.getVideos(author);

      let storageUsed = 0
      const weightFiles = files.map(file => file.weight)
      const weightVideos = videos.map(video => video.weight)
      const weightPhotos = photos.map(photos => photos.weight)

      if(weightFiles.length > 0) storageUsed += weightFiles.reduce((a, b) => a + b) 
      if(weightVideos.length > 0) storageUsed += weightVideos.reduce((a, b) => a + b) 
      if(weightPhotos.length > 0) storageUsed += weightPhotos.reduce((a, b) => a + b) 


      res.json({ storageUsed });
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }

      /**
   *
   * get max storage
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - Get max storage
   * @memberof FileController
   */
  public static async getMaxStorage(req: Request, res: Response, next: NextFunction) {
    try {
      const configs: Array<IConfig> = await Config.find({});
      res.json({maxStoraged: configs[0].max});
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }

  

  /**
   *
   * create a new File
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A File creted
   * @memberof FileController
   */
  public static async create(req: any, res: Response, next: NextFunction) {
    try {
      let file = req.file
      
      // create location to save
      const mimetype = file.mimetype;
      let folder = "files"
      let type = "file"
      const USERNAME = req.body.username
      const USER_FOLDER = `/home/streams-for-lab.co/${USERNAME?.toLowerCase().trim().replace(/ /g,'-')}`
      
      if(mimetype.includes("image")) {
        folder = "photos"
        type = "photo"
      }
      else if(mimetype.includes("video")) {
        folder = "videos"
        type = "video"
      }

      const destination = `${USER_FOLDER}/${folder}/${file.originalname}`

      console.log("File received in storage service: ",file);
      console.log("File Storage in: ", destination);
      
      // properties
      const author = req.params.author
      const path = destination
      const weight = file.size
      const upload_at = new Date()
      const name = file.originalname

      await  encryptAndSaveFile(file.buffer, path)
     
      

      if(mimetype.includes("image")){ // Save image
        const photoInstance:IPhoto = new Photo({name, path, weight, upload_at, author, shared_users:[], type});
        const photoSaved: IPhoto = await PhotoService.create(photoInstance);
        console.log("Image saved");
        res.json(photoSaved)

      }else if(mimetype.includes("video")){// Save video
        const videoInstance:IVideo = new Video({name, path, weight, upload_at, author, shared_users:[], type});
        const videoSaved: IVideo = await VideoService.create(videoInstance);
        console.log("Video saved");
        res.json(videoSaved);

      }else {// Save file
        const fileInstance:IFile = new File({name, path, weight, upload_at, author, shared_users:[], type});
        const fileSaved: IFile = await FileService.create(fileInstance);
        console.log("File saved");
        res.json(fileSaved);
      }

    } catch (error) {
      console.log("File saved error:", error);
      if(error.message.includes('E11000 duplicate key error')) return next(new HttpException(202, error.message))
      return next(new HttpException(error.status || 500, error.message));
    }
  }


    /**
   *
   * create a new File whne is save with sync
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A File creted
   * @memberof FileController
   */
     public static async createWithSync(req: any, res: Response, next: NextFunction) {
      try {
        let file = req.body
  
        console.log("File received in storage service: ",file);
        console.log("File Storage in: ", file.path);
        
        // properties
        file.author = req.params.author
        file.upload_at = new Date()
        file.shared_users = []
  
       console.log("File to save with sync: ", file);
       
        
  
        if(file.type === 'photo'){ // Save image
          const photoInstance:IPhoto = new Photo(file);
          const photoSaved: IPhoto = await PhotoService.create(photoInstance);
          console.log("Image saved");
          res.json(photoSaved)
  
        }else if(file.type === 'video'){// Save video
          const videoInstance:IVideo = new Video(file);
          const videoSaved: IVideo = await VideoService.create(videoInstance);
          console.log("Video saved");
          res.json(videoSaved);
  
        }else {// Save file
          const fileInstance:IFile = new File(file);
          const fileSaved: IFile = await FileService.create(fileInstance);
          console.log("File saved");
          res.json(fileSaved);
        }
  
      } catch (error) {
        console.log("File saved error:", error.message);
        if(error.message.includes('E11000 duplicate key error')) return next(new HttpException(202, error.message))
        return next(new HttpException(error.status || 500, error.message));
      }
    }

  /**
   *
   * Get File by id
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A File
   * @memberof FileController
   */
  public static async download(req: any, res: Response, next: NextFunction) {
    try {
      const { id, author } = req.params;
      console.log("Auhthor: ", author);
      
      const file: IFile | null = await FileService.getById(id);
     
      if (!file) throw new HttpException(404, 'File not found');
      console.log("File auhthor: ", file.author);
      if( author == file.author || file.shared_users.includes(author)) {
        const location = file.path
        console.log("Location:", location);
  
        const fileDecryped = await decryptFile(location)
        res.json({file: fileDecryped.toString("base64"), name: file.name});
        
      }else {
        throw new HttpException(403, 'Forbidden: The file is not his authorship.');
      }

    } catch (error) {
      console.log(error);
      
      return next(new HttpException(error.status || 500, error.message));
    }
  }

  /**
   *
   * Remove File synced by id 
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of FileS
   * @memberof FileController
   */
   public static async removeFileSyncedByPath(req: Request, res: Response, next: NextFunction) {
    try {
      const {author } = req.params;
      const { pathToRemove } = req.body
      console.log("Path received: ", pathToRemove);
      
        const file: IFile | null = await FileService.removeByPath(pathToRemove);
        if (!file) throw new HttpException(404, 'File not found');
        if( author != file.author) throw new HttpException(403, 'Forbidden: The file is not his authorship.');
        console.log(`File ${file.name} deleted`);
      res.sendStatus(200)
    } catch (error) {
      console.log(error);
      return next(new HttpException(error.status || 500, error.message));
    }
  }


  /**
   *
   * Remove File by id
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of FileS
   * @memberof FileController
   */
  public static async removeById(req: Request, res: Response, next: NextFunction) {
    try {
      const {author } = req.params;
      const filesToRemove = req.body.files
      console.log("Files received: ", filesToRemove);
      
      // If have one file to remove
      if(filesToRemove.length === 1){
        const id = filesToRemove[0]
        const file: IFile | null = await FileService.removeById(id);
        if (!file) throw new HttpException(404, 'File not found');
        if( author != file.author) throw new HttpException(403, 'Forbidden: The file is not his authorship.');
      
        const location = file.path
        fs.unlinkSync(path.resolve(location))
        console.log(`File ${file.name} deleted`);
      }else { // If have multiple files to remove
        filesToRemove.forEach(async (fileId: string) => {
          const file: IFile | null = await FileService.removeById(fileId);
          if (!file) throw new HttpException(404, 'File not found');
          if( author != file.author) throw new HttpException(403, 'Forbidden: The file is not his authorship.');
        
          const location = file.path
          fs.unlinkSync(path.resolve(location))
          console.log(`File ${file.name} deleted`);
        });
      }
      
      res.sendStatus(200)
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }

}
export default FileController;
