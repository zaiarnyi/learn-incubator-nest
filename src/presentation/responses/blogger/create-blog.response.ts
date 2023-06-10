import { Exclude, Expose, Type } from 'class-transformer';
import { CreateImagesResponse } from '../../requests/blogger/create-images.response';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusEnum } from '../../../domain/blogs/enums/subscription-status.enum';

@Exclude()
export class CreateBlogResponse {
  @Expose()
  @ApiProperty({ type: String, example: 42 })
  id: string;

  @Expose()
  @ApiProperty({ type: String, example: 'Denis' })
  name: string;

  @Expose()
  @ApiProperty({ type: String, example: 'some text' })
  description: string;

  @Expose()
  @ApiProperty({
    type: String,
    example:
      'https://www.adidas.fr/claquette-adilette-22/IG7494.html?cm_sp=SLOT-6.3-_-%3F_%3F_%3F_%3F_NEW-ARRIVALS-PRODUCT-SELECTION-GENDERED-_-PRODUCTSELECTIONCAROUSEL-PRODUCT-CARD-_-887795',
  })
  websiteUrl: string;

  @Expose()
  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Boolean, example: false, default: false })
  isMembership: boolean;

  @Expose()
  @Type(() => CreateImagesResponse)
  @ValidateNested()
  @ApiProperty({ type: CreateImagesResponse })
  images: CreateImagesResponse;

  @Expose()
  @ApiProperty({
    type: 'enum',
    enum: SubscriptionStatusEnum,
    default: SubscriptionStatusEnum.NONE,
    nullable: false,
    required: true,
  })
  currentUserSubscriptionStatus: SubscriptionStatusEnum;

  @Expose()
  @ApiProperty({ type: Number, example: 42, default: 0 })
  subscribersCount: 0;
}
