import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/services/user.service';



@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users: any

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(id: string) {
      //@ts-ignore
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
                  //@ts-ignore
            .subscribe(() => this.users = this.users.filter(x => x.id !== id));
    }
}
