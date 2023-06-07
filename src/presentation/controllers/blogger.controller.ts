import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  Inject,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { CreateBlogAction } from '../../application/actions/blogger/create-blog.action';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { UpdateBlogAction } from '../../application/actions/blogger/update-blog.action';
import { DeleteBlogByIdAction } from '../../application/actions/blogger/delete-blogById.action';
import { GetBlogsRequest, GetBlogsRequestWithSearch } from '../requests/blogs/get-blogs.request';
import { CreateBlogRequest } from '../requests/blogger/create-blog.request';
import { CreatePostByBlogIdRequest } from '../requests/blogger/create-post-by-blogId.request';
import { ParamPostByBlogRequest } from '../requests/blogger/param-post-by-blog.request';
import { GetAllBlogsResponse } from '../responses/blogger/get-all-blogs.response';
import { UserQueryRepository } from '../../infrastructure/database/repositories/users/query.repository';
import { DeletePostByBlogIdAction } from '../../application/actions/blogger/delete-post-by-blogId.action';
import { UpdatePostByBlogAction } from '../../application/actions/blogger/update-post-by-blog.action';
import { CheckBlogIdRequest } from '../requests/blogger/check-blog-id.request';
import { UserBannedByBlogRequest } from '../requests/blogger/user-banned-by-blog.request';
import { GetUserBannedByBlogResponse } from '../responses/blogger/get-user-banned-by-blog.response';
import { GetCommentsByBlogResponse } from '../responses/blogger/get-comments-by-blog.response';
import { GetCommentsByBlogsAction } from '../../application/actions/blogger/get-comments-by-blogs.action';
import { GetBannedUserAction } from '../../application/actions/blogger/users/get-banned-user.action';
import { GetBannedUserByBloggerRequest } from '../requests/blogger/get-banned-user-by-blogger.request';
import { BannedUserByBloggerAction } from '../../application/actions/blogger/users/banned-user-by-blogger.action';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import { ImageSizeValidator } from '../../infrastructure/validators/image-size.validator';
import { SaveWallpaperAction } from '../../application/actions/blogger/save-wallpaper.action';
import { SaveBlogMainImageAction } from '../../application/actions/blogger/save-blog-main-image.action';
import { SavePostMainImageAction } from '../../application/actions/blogger/save-post-main-image.action';
import { FileInformationDto } from '../../domain/blogger/dto/file-information.dto';
import { CreateImageResponse, CreateImagesResponse } from '../requests/blogger/create-images.response';

const filePipe = (validatorFiles: FileValidator = null) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 100_000 }),
      new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
      validatorFiles,
    ],
    exceptionFactory: (error) => {
      throw new BadRequestException([
        {
          field: 'file',
          message: error,
        },
      ]);
    },
  });

@UseGuards(JwtAuthGuard)
@Controller('blogger')
export class BloggerController {
  constructor(
    private readonly getBlogsService: GetAllBlogsAction,
    private readonly createBlogService: CreateBlogAction,
    private readonly createPostService: CreatePostAction,
    private readonly updateService: UpdateBlogAction,
    private readonly deleteService: DeleteBlogByIdAction,
    private readonly queryUserRepository: UserQueryRepository,
    private readonly deletePostAction: DeletePostByBlogIdAction,
    private readonly updatePostByBlogAction: UpdatePostByBlogAction,
    private readonly getCommentsAction: GetCommentsByBlogsAction,
    private readonly getBannedUserAction: GetBannedUserAction,
    private readonly changeBannedStatusUserAction: BannedUserByBloggerAction,
    private readonly saveWallpaperAction: SaveWallpaperAction,
    private readonly saveBlogMainImageAction: SaveBlogMainImageAction,
    private readonly savePostMainImageAction: SavePostMainImageAction,
  ) {}
  @Get('blogs')
  async getBlogs(@Query() query: GetBlogsRequestWithSearch, @Req() req: any): Promise<GetAllBlogsResponse> {
    return this.getBlogsService.execute(query, req?.user?.id);
  }

  @Get('blogs/comments')
  async getCommentsByBlog(@Query() query: GetBlogsRequest, @Req() req: any): Promise<GetCommentsByBlogResponse> {
    return this.getCommentsAction.execute(query, req.user.id);
  }

  @Get('users/blog/:id')
  async getBannedUsersByBlog(
    @Query() query: GetBannedUserByBloggerRequest,
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<GetUserBannedByBlogResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.getBannedUserAction.execute(Number(id), query, req.user.id);
  }

  @Post('blogs')
  async createBlog(@Body() body: CreateBlogRequest, @Req() req: any) {
    return this.createBlogService.execute(body, req.user);
  }

  @Post('blogs/:blogId/posts')
  async createPostByBlog(@Body() body: CreatePostByBlogIdRequest, @Param('blogId') id: string, @Req() req: any) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.createPostService.execute({ ...body, blogId: Number(id) }, req?.user);
  }

  @Post('blogs/:blogId/images/wallpaper')
  @UseInterceptors(FileInterceptor('file'))
  async imagesWallpaperSave(
    @Param('blogId') id: string,
    @UploadedFile(filePipe(new ImageSizeValidator({ width: 1028, height: 312 })))
    file: Express.Multer.File,
    @Req() req: any,
  ): Promise<CreateImagesResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.saveWallpaperAction.execute(Number(id), file.buffer, file.originalname, req.user);
  }

  @Post('blogs/:blogId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async imagesMainSave(
    @Param('blogId') id: string,
    @UploadedFile(filePipe(new ImageSizeValidator({ width: 156, height: 156 }))) file: Express.Multer.File,
    @Req() req: any,
  ): Promise<CreateImagesResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.saveBlogMainImageAction.execute(Number(id), file.buffer, file.originalname, req.user);
  }

  @Post('blogs/:blogId/posts/:postId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async imagesMainForPostSave(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @UploadedFile(filePipe(new ImageSizeValidator({ width: 940, height: 432 }))) file: Express.Multer.File,
    @Req() req: any,
  ): Promise<CreateImageResponse> {
    if (isNaN(Number(blogId)) || isNaN(Number(postId))) {
      throw new NotFoundException();
    }
    return this.savePostMainImageAction.execute(
      Number(blogId),
      Number(postId),
      file.buffer,
      file.originalname,
      req.user,
    );
  }

  @Put('blogs/:id')
  @HttpCode(204)
  async updateBlog(@Param() param: CheckBlogIdRequest, @Body() body: CreateBlogRequest, @Req() req: any) {
    return this.updateService.execute(param.id, body, req?.user);
  }

  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async updatePostByBlog(
    @Body() body: CreatePostByBlogIdRequest,
    @Param() params: ParamPostByBlogRequest,
    @Req() req: any,
  ) {
    if (isNaN(Number(params.postId))) {
      throw new NotFoundException();
    }
    return this.updatePostByBlogAction.execute(
      { ...body, blogId: params.blogId },
      Number(params.postId),
      req?.user?.id,
    );
  }

  @Put('users/:id/ban')
  @HttpCode(204)
  async setBanToUser(@Param('id') id: string, @Body() body: UserBannedByBlogRequest, @Req() req: any): Promise<void> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    await this.changeBannedStatusUserAction.execute(Number(id), body, req.user.id);
  }

  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param() param: CheckBlogIdRequest, @Req() req: any) {
    return this.deleteService.execute(param.id, req?.user?.id);
  }

  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByBlog(@Param() params: ParamPostByBlogRequest, @Req() req: any) {
    if (isNaN(Number(params.postId))) {
      throw new NotFoundException();
    }
    return this.deletePostAction.execute(params.blogId, Number(params.postId), req?.user?.id);
  }
}
