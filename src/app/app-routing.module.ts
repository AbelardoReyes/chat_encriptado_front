import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { UserComponent } from './components/sections/home/user/user.component';
import { ChatSocketComponent } from './components/sections/chat/chat-socket/chat-socket.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {path: 'home', component: UserComponent},
  {path: 'chat', component: ChatSocketComponent},
  { path: '*', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
