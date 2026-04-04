import { IsEmail, IsString, MinLength, IsOptional, MaxLength, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Yaroqli email manzilini kiriting' })
  email: string;

  @IsString({ message: 'Parol kiritilishi shart' })
  @MinLength(6, { message: 'Parol kamida 6ta belgidan iborat bo\'lishi kerak' })
  password: string;
}

export class RegisterDto {
  @IsString({ message: 'Ism sharif kiritilishi shart' })
  @MinLength(3, { message: 'Ism sharif juda qisqa' })
  fullName: string;

  @IsEmail({}, { message: 'Yaroqli email manzilini kiriting' })
  email: string;

  @IsString({ message: 'Parol kiritilishi shart' })
  @MinLength(8, { message: 'Parol kamida 8ta belgidan iborat bo\'lishi kerak' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { 
      message: 'Parol juda oddiy. U bosh harf, raqam va maxsus belgilarni o\'z ichiga olishi kerak!' 
  })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ContactDto {
  @IsString()
  @MinLength(3, { message: 'Ism kamida 3 belgidan iborat bo\'lishi kerak' })
  name: string;

  @IsEmail({}, { message: 'Email noto\'g\'ri' })
  email: string;

  @IsString()
  @MinLength(10, { message: 'Xabar matni juda qisqa. Kamida 10ta belgi bo\'lishi kerak!' })
  @MaxLength(1000, { message: 'Xabar maksimal uzunlikdan oshib ketdi.' })
  message: string;
}
