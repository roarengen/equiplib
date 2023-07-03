import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user';

@Pipe({
  name: 'filterOnRoleId'
})
export class FilterOnRoleIdPipe implements PipeTransform {
  transform(users: User[], roleId: number): User[] {
    if (!users || !roleId) {
      return users;
    }
    return users.filter(user => user.roleid === roleId);
  }
}
