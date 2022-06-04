import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IRoute } from '../interfaces';
import { FileControler } from '../controller';
import { isDefinedParamMiddleware, getAuthUserMiddleware } from '../middlewares';
import upload from '../middlewares/multer'

/**
 *
 * Managament the routes of File
 * @category Routes
 * @class FileRouter
 * @implements {IRoute}
 */
class FileRouter implements IRoute {
  public router = Router();

  public pathIdParam = '/:id';
  public pathAuthorParam = '/:author'

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {

     // Get storage used by user
     this.router.get(
      `/storage${this.pathAuthorParam}`,
      isDefinedParamMiddleware('params', 'author'),
      (req: Request, res: Response, next: NextFunction) => FileControler.getStorageByUser(req, res, next),
    );
    
    // Create dirs to user
    this.router.get(
      `/mkdir${this.pathAuthorParam}`,
      (req: Request, res: Response, next: NextFunction) => FileControler.mkdir(req, res, next),
    );
    
     // Get max storage
     this.router.get(
      `/max-storage${this.pathAuthorParam}`,
      isDefinedParamMiddleware('params', 'author'),
      (req: Request, res: Response, next: NextFunction) => FileControler.getMaxStorage(req, res, next),
    );

    // list all shared files
    this.router.get(`/shared${this.pathAuthorParam}`,
    isDefinedParamMiddleware('params', 'author'),
    (req: Request, res: Response, next: NextFunction) => FileControler
      .listAllSharedFIles(req, res, next));


    // Save File with sync
     this.router.post(`/sync${this.pathAuthorParam}`,
     isDefinedParamMiddleware('params', 'author'),
     (req: Request, res: Response, next: NextFunction) => FileControler
       .createWithSync(req, res, next),
   );

    // list Files
    this.router.get(`${this.pathAuthorParam}`,
    isDefinedParamMiddleware('params', 'author'),
    (req: Request, res: Response, next: NextFunction) => FileControler
      .list(req, res, next));

    // Save File
    this.router.post(this.pathAuthorParam,
      isDefinedParamMiddleware('params', 'author'),
      upload.single('file'),
      (req: Request, res: Response, next: NextFunction) => FileControler
        .create(req, res, next),
    );

    // Share File
    this.router.post(`/share${this.pathAuthorParam}`,
      isDefinedParamMiddleware('params', 'author'),
      (req: Request, res: Response, next: NextFunction) => FileControler
        .shareFileWithUser(req, res, next),
    );

    // Get File
    this.router.get(
      `${this.pathIdParam}${this.pathAuthorParam}`,
      isDefinedParamMiddleware(),
      isDefinedParamMiddleware('params', 'author'),
      (req: Request, res: Response, next: NextFunction) => FileControler
        .download(req, res, next),
    );

    // Remove File synced
    this.router.delete(
      `/sync${this.pathAuthorParam}`,
      isDefinedParamMiddleware('params', 'author'),
      (req: Request, res: Response, next: NextFunction) => FileControler
        .removeFileSyncedByPath(req, res, next),
    );

    // Remove File
    this.router.delete(
      `${this.pathAuthorParam}`,
      isDefinedParamMiddleware('params', 'author'),
      (req: Request, res: Response, next: NextFunction) => FileControler
        .removeById(req, res, next),
    );
  }
}
export default new FileRouter().router;
