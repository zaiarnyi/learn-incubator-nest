// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Injectable } from '@nestjs/common';
// import { DeleteResult } from 'mongodb';
// import { CreateBlogDto } from '../../../../../domain/blogs/dto/create-blog.dto';
// import { Blog, BlogDocument } from '../../../../../domain/blogs/entities/blog.entity';
//
// @Injectable()
// export class MainBlogsRepository {
//   constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
//   async createBlog(dto: CreateBlogDto): Promise<BlogDocument> {
//     return this.blogModel.create(dto);
//   }
//
//   async updateBlog(id: string, userId: string, dto: CreateBlogDto): Promise<BlogDocument> {
//     return this.blogModel.findByIdAndUpdate(id, dto);
//   }
//
//   async deleteBlogById(id: string): Promise<BlogDocument> {
//     return this.blogModel.findByIdAndDelete(id);
//   }
//
//   async deleteAllBlogs(): Promise<DeleteResult> {
//     return this.blogModel.deleteMany();
//   }
//
//   async bindUserToBlog(id: string, userId: string, userLogin: string): Promise<any> {
//     return this.blogModel.findByIdAndUpdate(id, { userId, userLogin });
//   }
//
//   async changeBannedStatus(userId: string, isBanned: boolean): Promise<any> {
//     return this.blogModel.updateMany({ userId }, { isBanned });
//   }
//
//   async changeBannedStatusByBlogger(userId: string, blogId: string, isBanned: boolean): Promise<any> {
//     return this.blogModel.updateMany({ userId, _id: blogId }, { isBanned });
//   }
//
//   async changeBannedStatusByBlogId(blogId: string, isBanned: boolean): Promise<any> {
//     return this.blogModel.updateOne({ _id: blogId }, { isBanned, banDate: isBanned ? new Date().toISOString() : null });
//   }
// }
