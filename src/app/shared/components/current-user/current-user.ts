import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ZafClientService } from '../../services/zafclient.service';

@Component({
  selector: 'app-current-user',
  standalone: true,
  imports: [],
  templateUrl: './current-user.html',
  styleUrl: './current-user.scss',
})
export class CurrentUser implements OnInit {
  private readonly zaf = inject(ZafClientService);
  user: any;

  async ngOnInit() {
    this.zaf.get('currentUser').subscribe({
      next: (res) => {
        this.user = res?.currentUser ?? res;
      },
      error: (err) => {
        console.error('Failed to load current user', err);
      },
    });
  }
}
