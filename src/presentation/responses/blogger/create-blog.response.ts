import { Exclude, Expose, Type } from 'class-transformer';
import { CreateImagesResponse } from '../../requests/blogger/create-images.response';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
