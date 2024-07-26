import {
    Controller
} from '@nestjs/common';
import { FilesService } from './files.service';
  
  @Controller('files')
  export class FilesController {
    constructor(private readonly filesService: FilesService) {}
  
    // @Post('upload-files')
    // @UseInterceptors(FilesInterceptor('files'))
    // async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    //   const fileNames = await this.filesService.uploadFiles(files, 'upload');
    //   return fileNames;
    // }
  
    // @Post('delete-files')
    // async deletesFile(@Body() {files}: {files: string[]}) {    
    //   await this.filesService.deleteFiles(files, 'upload');
    //   return HTTP_MESSAGE.FILE_DELETE
    // }
  }
  