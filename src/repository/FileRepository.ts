/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { ICrud, IFile } from '../interfaces';
import { File } from '../models';
import mongoose from 'mongoose'

/**
 *
 * The File repository 
 * @category Repositorys
 * @class FileRepository
 * @implements {ICrud<IFile, string>}
 */
class FileRepository implements ICrud<IFile, string> {
  /**
   *
   *
   * @param {IFile} File - The File to create
   * @return {Promise<IFile>}  A File created
   * @memberof FileRepository
   */
  async create(File: IFile): Promise<IFile> {
    return File.save();
  }

  /**
   *
   *
   * @return {Promise<Array<IFile>>}  A list of Files
   * @memberof FileRepository
   */
  async list(): Promise<Array<IFile>> {
    return File.find({});
  }

  /**
   *
   *
   * @param {string} path - The path to find
   * @return {Promise<IFile>}  A File
   * @memberof FileRepository
   */
  async getByPath(path: string): Promise<IFile | null> {
    return File.findOne({ path });
  }

  /**
   *
   *
   * @param {string} id - The id to find
   * @return {Promise<IFile>}  A File
   * @memberof FileRepository
   */
   async getById(id: string): Promise<IFile | null> {
    return File.findById(id);
  }


  /**
   *
   *
   * @param {IFile} File - The File to remove
   * @return {Promise<IFile>}  A File removed
   * @memberof FileRepository
   */
  async remove(File: IFile): Promise<IFile> {
    if (File._id) await File.remove();
    return File;
  }

  /**
   *
   *
   * @param {string} id - The id to find
   * @return {Promise<IFile>}  A File removed
   * @memberof FileRepository
   */
  async removeById(id: string): Promise<IFile | null> {
    const FileToDelete = await this.getById(id);
    if (FileToDelete) await FileToDelete.remove();
    return FileToDelete;
  }

  /**
   *
   *
   * @param {IFile} File - The File to updated
   * @return {Promise<IFile>}  A File updated
   * @memberof FileRepository
   */
  async update(File: IFile): Promise<IFile> {
    if (File._id) await File.update();
    return File;
  }

  /**
   *
   *
   * @param {string} id - The id to find
   * @param {IFile} File - The File to updated
   * @return {Promise<IFile>} A File updated
   * @memberof FileRepository
   */
  async updateById(id: string, file: IFile):
  Promise<IFile | null > {
    const fileToUpdate = await this.getById(id);
    if (fileToUpdate) {
      fileToUpdate.name = file.name;
      fileToUpdate.path = file.path;
      fileToUpdate.weight = file.weight;
      fileToUpdate.upload_at = file.upload_at;
      fileToUpdate.author = file.author;
      fileToUpdate.shared_users = file.shared_users;
      await fileToUpdate.update();
    }
    return fileToUpdate;
  }

   /**
   *
   *
   * @return {Promise<Array<IFile>>} List of shared files
   * @memberof FileRepository
   */
  async getSharedFiles(user: string): Promise<Array<IFile>> {
    return File.find({ shared_users: new mongoose.Types.ObjectId(user) }).populate('author');
  }

   /**
   *
   *
   * @return {Promise<IFile>} Share file with a user
   * @memberof FileRepository
   */
    async shareFileWithUser(userToShare: string, _id: String): Promise<IFile | null> {
      return File.findByIdAndUpdate(_id, { $addToSet: { shared_users: new mongoose.Types.ObjectId(userToShare)} })
    }

   /**
   *
   *
   * @return {Promise<Array<IFile>>} List of shared files
   * @memberof FileRepository
   */
  async getFiles(author: string): Promise<Array<IFile>> {
    return File.find({ author });
  }
}
export default new FileRepository();
