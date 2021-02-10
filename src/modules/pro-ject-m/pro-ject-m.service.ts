import { All, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { PorjectGroup } from 'src/model/ProjectDetails/PorjectGroup.model';
import { Project } from 'src/model/ProjectDetails/Project.model';
import { ProjectCategory } from 'src/model/ProjectDetails/ProjectCategory.model';
import { ProjectComment } from 'src/model/ProjectDetails/ProjectComment.model';
import { ProjectMieage } from 'src/model/ProjectDetails/ProjectMileage.model';
import { ProjectRoles } from 'src/model/ProjectDetails/ProjectRoles.model';
import { PmLable } from 'src/model/ProjectM/lable.model';
import { TaskCategroy } from 'src/model/TaskModel/TaskCategroy.model';
import { User } from 'src/model/User/user.model';
import { Pagination, QueryPage, QueryStructure } from 'src/utils/pageations';


@Injectable()
export class ProJectMService {

  private ParsingPage(value, originMethod) {
    return {
      sucess: true,
      data: {
        total: value.total,
        current: value.page,
        pageSize: value.size,
        totalPage: value.pages,
        data: originMethod()
      }
    }
  }

  // 构造器
  constructor(
    private readonly jwtService: JwtService,


    // 测试用，删除即删
    @InjectModel(TaskCategroy) private readonly TaskCategroyModel: ModelType<TaskCategroy>,

    @InjectModel(PmLable) private readonly PmLableModel: ModelType<PmLable>,
    @InjectModel(ProjectComment) private readonly ProjectCommentModel: ModelType<ProjectComment>,
    @InjectModel(Project) private readonly ProjectModel: ModelType<Project>,
    @InjectModel(User) private readonly UserModel: ModelType<User>,
    @InjectModel(ProjectCategory) private readonly ProjectCategoryModel: ModelType<ProjectCategory>,
    @InjectModel(ProjectMieage) private readonly ProjectMieageModel: ModelType<ProjectMieage>,
    @InjectModel(ProjectRoles) private readonly ProjectRolesModel: ModelType<ProjectRoles>,
    @InjectModel(PorjectGroup) private readonly PorjectGroupModel: ModelType<PorjectGroup>,


  ) { }


  // -----------------------------项目组-----------------
  // 查询项目组
  async getPorjectGroup(req: any) {
    return await this.PorjectGroupModel.find().exec()
  }

  // 创建项目组
  async createPorjectGroup(body: PorjectGroup) {
    return await this.PorjectGroupModel.create(body)
  }

  // 编辑项目组
  async editePorjectGroup(req: any, body: PorjectGroup) {
    let { _id } = QueryStructure(req)
    return await this.PorjectGroupModel.findByIdAndUpdate(_id, body)
  }

  // 删除项目组 可以批量删除 ,注意，删除项目内角色 会删除连带的任务( 未做 )
  async deletePorjectGroup(req: any) {
    let { idList } = QueryStructure(req)
    let List = idList.split(',')
    await List.forEach(async (v) => {
      return await this.PorjectGroupModel.findByIdAndDelete(v)
    })
    return {
      sucess: true,
      message: '删除成功！'
    }
  }

  // -----------------------------项目内角色-----------------
  // 获取项目内角色
  async getProjectRoles(req: any) {
    let { current, pageSize, originGroupId } = QueryPage(req)

    let res = null
    // 查询
    if (originGroupId) {
      res = await Pagination(this.ProjectRolesModel).
        page(current).size(pageSize).display(5).find({
          originGroupId: originGroupId || undefined
        }).exec()
    } else {
      res = await Pagination(this.ProjectRolesModel).
        page(current).size(pageSize).display(5).find({}).exec()
    }

    return this.ParsingPage(res, () => res.records)


  }

  // 创建项目项目内角色
  async createProjectRoles(body: ProjectRoles) {
    return await this.ProjectRolesModel.create(body)
  }

  // 编辑项目项目内角色
  async editeProjectRoles(req: any, body: ProjectRoles) {
    let { _id } = QueryStructure(req)
    return await this.ProjectRolesModel.findByIdAndUpdate(_id, body)
  }

  // 删除项目项目内角色 可以批量删除 ,注意，删除项目内角色 会删除连带的任务( 未做 )
  async deleteProjectRoles(req: any) {
    let { idList } = QueryStructure(req)
    let List = idList.split(',')
    await List.forEach(async (v) => {
      return await this.ProjectRolesModel.findByIdAndDelete(v)
    })
    return {
      sucess: true,
      message: '删除成功！'
    }
  }

  // -----------------------------项目里程碑逻辑-----------------
  // 获取里程碑
  async getProjectMieage(req: any) {
    let { current, pageSize, } = QueryPage(req)
    // 查询
    let res = await Pagination(this.ProjectMieageModel).page(current).size(pageSize).display(5).find({}).exec()
    return this.ParsingPage(res, () => res.records)
  }

  // 创建项目里程碑
  async createProjectMieage(body: ProjectMieage) {
    return await this.ProjectMieageModel.create(body)
  }

  // 编辑项目里程碑
  async editeProjectMieage(req: any, body: ProjectMieage) {
    let { _id } = QueryStructure(req)
    await this.ProjectMieageModel.findByIdAndUpdate(_id, body)
    return {
      success: true,
      message: "编辑成功"
    }
  }

  // 删除项目里程碑 可以批量删除 ,注意，删除里程碑 会删除连带的任务( 未做 )
  async deleteProjectMieage(req: any) {
    let { idList } = QueryStructure(req)

    let List = idList.split(',')
    await List.forEach(async (v) => {
      return await this.ProjectMieageModel.findByIdAndDelete(v)
    })
    return {
      sucess: true,
      message: '删除成功！'
    }
  }

  // -----------------------------项目分类逻辑-----------------
  // 获取分类的列表结构
  async getCatList() {
    return this.ProjectCategoryModel.find()
  }


  // 查询项目分类信息 默认分页。支持多字段查询
  async getProjectCategory(req: any) {
    let { current, pageSize, } = QueryPage(req)
    // 查询
    let res = await Pagination(this.ProjectCategoryModel).page(current).size(pageSize).display(5).find({}).exec()
    return this.ParsingPage(res, () => res.records)
  }

  // 创建项目分类
  async createProjectCategory(body: ProjectCategory) {
    return await this.ProjectCategoryModel.create(body)
  }

  // 编辑项目分类
  async editeProjectCategory(req: any, body: ProjectCategory) {
    let { _id } = QueryStructure(req)
    return await this.ProjectCategoryModel.findByIdAndUpdate(_id, body)
  }

  // 删除项目分类 可以批量删除
  async deleteProjectCategory(req: any) {
    let { idList } = QueryStructure(req)

    let List = idList.split(',')
    await List.forEach(async (v) => {
      return await this.ProjectCategoryModel.findByIdAndDelete(v)
    })
    return {
      sucess: true,
      message: '删除成功！'
    }
  }

  // -----------------------------项目基础属性逻辑-----------------
  // 查询项目基础信息 默认分页。支持多字段查询
  async getProject(req: any) {
    let { current, pageSize, projectState } = QueryPage(req)

    // 解析当前登录用户的讯息
    const tokenMessage = await this.jwtService.verifyAsync(req.headers!.token)

    let res = null
    // 特殊查询，‘属于我创建’的时候    
    switch (projectState) {
      case '0':
        // 一般查询
        res = await Pagination(this.ProjectModel).page(current).size(pageSize).display(5).find({
          projectState: projectState
        }).exec()
        break;

      case '1':
        res = await Pagination(this.ProjectModel).page(current).size(pageSize).display(5).find({
          projectState: projectState
        }).exec()
        break;

      case '2':
        res = await Pagination(this.ProjectModel).page(current).size(pageSize).display(5).find({}).exec()
        break;

      case '3':
        res = await Pagination(this.ProjectModel).page(current).size(pageSize).display(5).find({
          projectState: projectState
        }).exec()
        break;

      case "4":
        res = await Pagination(this.ProjectModel).page(current).size(pageSize).display(5).find({
          projectManagerId: tokenMessage._id
        }).exec()
        break;

      default:
        break;
    }


    return this.ParsingPage(res, () => res.records)
  }

  // 项目列表数据统计
  async getTotalforProjectType(req: any) {

    // 解析当前登录用户的讯息
    const tokenMessage = await this.jwtService.verifyAsync(req.headers!.token)

    // 进行四种类型的统计
    const myCreate = await this.ProjectModel.find({ projectManagerId: tokenMessage._id }).exec()
    const runing = await this.ProjectModel.find({ projectState: '3' }).exec()
    const extension = await this.ProjectModel.find({ projectState: "1" }).exec()
    const notStarted = await this.ProjectModel.find({ projectState: "0" }).exec()
    const all = await this.ProjectModel.find().exec()

    return {
      success: true,
      data: {
        runing: runing.length,
        myCreate: myCreate.length,
        extension: extension.length,
        notStarted: notStarted.length,
        all: all.length
      }
    }

  }

  // 创建项目基础信息
  async createProject(body: Project) {
    return await this.ProjectModel.create(body)
  }

  // 编辑项目基础信息
  async editeProject(req: any, body: Project) {
    let { _id } = QueryStructure(req)
    return await this.ProjectModel.findByIdAndUpdate(_id, body)
  }

  // 删除项目基础信息 可以批量删除
  async deleteProject(req: any) {
    let { idList } = QueryStructure(req)

    let List = idList.split(',')
    await List.forEach(async (v) => {
      return await this.ProjectModel.findByIdAndDelete(v)
    })

    return {
      sucess: true,
      message: '删除成功！'
    }
  }

  // -----------------------------项目标注逻辑-----------------
  // 查询标注信息 默认分页。支持多字段查询
  async getPmLableList(req: any) {
    let { current, pageSize, } = QueryPage(req)
    // 查询
    let res = await Pagination(this.PmLableModel).page(current).size(pageSize).display(5).find({}).exec()
    return this.ParsingPage(res, () => res.records)
  }

  // 创建标注
  async createPmLable(body: PmLable) {
    return await this.PmLableModel.create(body)
  }

  // 编辑标注
  async editePmLable(req: any, body: PmLable) {
    let { _id } = QueryStructure(req)
    return await this.PmLableModel.findByIdAndUpdate(_id, body)
  }

  // 删除标注 可以批量删除
  async deletePmLable(req: any) {
    let { idList } = QueryStructure(req)

    let List = idList.split(',')
    List.forEach(async (v) => {
      return await this.PmLableModel.findByIdAndDelete(v)
    })
    return {
      sucess: true,
      message: '删除成功！'
    }
  }

  // -----------------------------项目怕评论逻辑-----------------
  // 查询评论信息 默认分页。支持多字段查询
  async getProjectCommentList(req: any) {
    let { current, pageSize, } = QueryPage(req)
    // 查询
    let res = await Pagination(this.ProjectCommentModel).page(current).size(pageSize).display(5).find({}).exec()
    return this.ParsingPage(res, () => res.records)
  }

  // 创建评论
  async createProjectComment(body: ProjectComment) {
    return await this.ProjectCommentModel.create(body)
  }


  // 删除评论 可以批量删除
  async deleteProjectComment(req: any) {
    let { idList } = QueryStructure(req)
    let List = idList.split(',')
    await List.forEach(async (v) => {
      return await this.ProjectCommentModel.findByIdAndDelete(v)
    })
    return {
      sucess: true,
      message: '删除成功！'
    }
  }



}
