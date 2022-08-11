import { IsString } from 'class-validator';

class CreateUserDTO {
  @IsString()
  public name: string;

  @IsString()
  public email: string;
}

export default CreateUserDTO;
