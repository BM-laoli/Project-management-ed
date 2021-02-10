import { ApiPropertyOptional } from "@nestjs/swagger"
import { prop, Ref } from "@typegoose/typegoose"
import { IsNotEmpty } from "class-validator"

// 项目中的角色
export class PorjectGroup {

  @ApiPropertyOptional({ description: '项目组名称', example: 'ISBD109U43' })
  @IsNotEmpty({ message: '名称不能为空' })
  @prop({})
  name: string

  @ApiPropertyOptional({ description: '项目组描述', example: 'ISBD109U43' })
  @IsNotEmpty({ message: '描述不能为空' })
  @prop({})
  descriptin: string

}
