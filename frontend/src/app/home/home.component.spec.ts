import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../shared/services/auth/auth.service';
import { spyOnClass } from '../utils/testing/helper-functions';
import { Spied } from '../utils/testing/spied.interface';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: Spied<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeComponent,
        {
          provide: AuthService,
          useFactory: () => authService = spyOnClass(AuthService)
        }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = TestBed.inject(HomeComponent);
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });
});
