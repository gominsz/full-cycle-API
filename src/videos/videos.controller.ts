import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpCode, UploadedFile, ParseFilePipe, UseInterceptors } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { VideoFileValidator } from './video-file-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() createVideoDto: CreateVideoDto, 
    @UploadedFile(new ParseFilePipe({
      validators: [
        new VideoFileValidator({
          maxSize: 1024 * 1024 * 100,
          mineType: 'video/mp4'
        }),
      ],
      errorHttpStatusCode: 422,
    }),
    ) 
    file: Express.Multer.File
    ) {
      console.log(file);
      return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @HttpCode(404) // representa No content (Sem conteudo)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
