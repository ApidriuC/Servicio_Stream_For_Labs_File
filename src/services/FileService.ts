/* eslint-disable class-methods-use-this */
import { ICrud, IFile} from '../interfaces';
import { FileRepository } from '../repository';
import { File} from '../models';

/**
 *
 * The File service,layer of repository pattern
 * @category Services
 * @class FileService
 * @implements {ICrud<IFile, string>}
 */
class FileService implements ICrud<IFile, string> {
  /**
   *
   * Create a File
   * @param {IFile} File - The File to create
   * @return {Promise<IFile>}  A File created
   * @memberof FileService
   */
  async create(File: IFile): Promise<IFile> {
    return FileRepository.create(File);
  }

  /**
   *
   * List all File
   * @return {Promise<Array<IFile>>}  A list of tasks
   * @memberof FileService
   */
  async list(): Promise<Array<IFile>> {
    return FileRepository.list();
  }

  /**
   *
   * Find by id a File
   * @param {string} id - The id to find
   * @return {Promise<IFile>}  A File
   * @memberof FileService
   */
  async getById(id: string): Promise<IFile| null> {
    return FileRepository.getById(id);
  }


  /**
   *
   * Find by path a File
   * @param {string} path - The path to find
   * @return {Promise<IFile>}  A File
   * @memberof FileService
   */
   async getByPath(path: string): Promise<IFile| null> {
    return FileRepository.getByPath(path);
  }


  /**
   *
   * Remove a File
   * @param {IFile} File - The File to remove
   * @return {Promise<IFile>}  A File removed
   * @memberof FileService
   */
  async remove(File: IFile): Promise<IFile> {
    return FileRepository.remove(File);
  }

  /**
   *
   * Remove by id a File
   * @param {string} id - The id to find
   * @return {Promise<IFile>}  A File removed
   * @memberof FileService
   */
  async removeById(id: string): Promise<IFile| null> {
    const taskToDelete = await this.getById(id);
    if (taskToDelete) await taskToDelete.remove();
    return taskToDelete;
  }

   /**
   *
   * Remove by path a File synced
   * @param {string} path - The path to find
   * @return {Promise<IFile>}  A File removed
   * @memberof FileService
   */
    async removeByPath(path: string): Promise<IFile| null> {
      const taskToDelete = await this.getByPath(path);
      if (taskToDelete) await taskToDelete.remove();
      return taskToDelete;
    }

  /**
   *
   * Update a File
   * @param {IFile} File - The File to updated
   * @return {Promise<IFile>}  A File updated
   * @memberof FileService
   */
  async update(File: IFile): Promise<IFile> {
    return FileRepository.update(File);
  }

  /**
   *
   * Update by id a File
   * @param {string} id - The id to find
   * @param {IFile} File - The File to updated
   * @return {Promise<IFile>} A File updated
   * @memberof FileService
   */
  async updateById(id: string, body: Object): Promise<IFile| null > {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IFile| null>((resolve, _) => {
      File.findOneAndUpdate({ _id: id }, { ...body }, { new: true },
        (error, task: IFile| null) => resolve(task));
    });
  }

  async getFiles(author: string): Promise<Array<IFile>> {
    return FileRepository.getFiles(author);
  }

  async getShareFiles(author: string): Promise<Array<IFile>> {
    return FileRepository.getSharedFiles(author);
  }

  /**
   *
   *
   * @return {Promise<IFile>} Share file with a user
   * @memberof FileService
   */
    async shareFileWithUser(userToShare: string, _id: String): Promise<IFile | null> {
      return FileRepository.shareFileWithUser(userToShare, _id)
    }
}

export default new FileService();
