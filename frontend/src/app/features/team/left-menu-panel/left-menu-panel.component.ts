import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/interfaces';
import * as authActions from '../../../ngrx/actions/auth.actions';
import { MatDialog } from '@angular/material';
import { UserSettingsComponent } from '../../../shared/components/user-settings/user-settings.component';

@Component({
    selector: 'left-menu-panel',
    templateUrl: 'left-menu-panel.component.html',
    styleUrls: ['left-menu-panel.component.scss']
})

export class LeftMenuPanelComponent implements OnInit {
    currentUser: any;
    menuItems = [
        { link: 'notifications', label: 'Notifications', color: '', icon: 'notifications' },
        { link: 'task-stream', label: 'Task Stream', color: '', icon: 'assignment_turned_in' },
        { link: 'personal-tasks', label: 'Personal Tasks', color: '', icon: 'assignment_turned_in' },
        {
            link: 'forum', label: 'Open Forums', disabled: true, color: '', icon: 'forum',
            items: [
                { link: 'forum/general', label: '-General' }
            ]
        },
        { link: 'private-teams', label: 'Private Teams', color: '', icon: 'supervisor_account', items: [
            { link: 'private-teams', label: '-Team service project' }
        ] },
        { link: 'messages', label: 'Direct Messages', color: '', icon: 'record_voice_over' },
    ];

    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog
    ) {
        this.store.select(state => state.currentUser).subscribe(res => {
            this.currentUser = res;
        }, (err) => {
            console.log(err);
        });
    }

    ngOnInit() {
        this.getCurrentUserData();
    }

    getCurrentUserData() {
        this.store.dispatch(new authActions.GetCurrentUserAction());
    }

    mySettings() {
        const dialogRef = this.dialog.open(UserSettingsComponent, {
            width: '90vw',
            height: '90vh',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}
