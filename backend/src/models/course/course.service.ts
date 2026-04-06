import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/config/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) { }
  async createCourse(payload: CreateCourseDto) {
    const existTitle = await this.prisma.course.findFirst({
      where: {
        title: payload.title
      }
    })
    if (existTitle) throw new ConflictException("Course title is already in use")
    const data = await this.prisma.course.create({
      data:{
        title:payload.title,
        imageUrl:payload.imageUrl,
        level:payload.level,
        isActive:payload.isActive,
        description:payload.description
      }
    })
    return{
      status:200,
      success:true,
      message:"Course is successfully created !"
    }
  }
  async deleteCourseById(id:number){
    const existCourse= await this.prisma.course.findUnique({
      where:{id}
    })
    if(!existCourse) throw new NotFoundException("Course is not found !")
    
    const data= await this.prisma.course.update({
      where:{
        id
      },
      data:{
        isActive:false
      }
    })

    return{
      status:200,
      message:"Course is successfully  deleted"
    }
  }

}
