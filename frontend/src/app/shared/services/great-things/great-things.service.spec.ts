import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { SidelogService } from 'sidelog-angular';
import { environment } from '../../../../environments/environment';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { Spied } from '../../../utils/testing/spied.interface';
import { GreatThing } from '../../models/GreatThing.model';
import { Picture } from '../../models/Picture.model';
import { AuthService } from '../auth/auth.service';

import { GreatThingsService } from './great-things.service';

fdescribe('GreatThingsService', () => {
  let service: GreatThingsService;
  let http: HttpTestingController;
  let auth: Spied<AuthService>;
  let logger: Spied<SidelogService>;
  let testSub: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        GreatThingsService,
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService)
        },
        {
          provide: SidelogService,
          useFactory: () => logger = spyOnClass(SidelogService)
        }
      ]
    });
    service = TestBed.inject(GreatThingsService);
    http = TestBed.inject(HttpTestingController);
    auth.userId.and.returnValue('USER_ID');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('retrieve', () => {
    it('makes a GET request to the correct endpoint', () => {
      testSub = service.retrieve({
        'sort-by': 'createdAt',
        page: 3,
        search: 'SEARCH TEXT'
      }).subscribe();
      http.expectOne((httpCall) => {
        return httpCall.url === `${environment.BACKEND_BASE}/users/USER_ID/great-things` &&
          httpCall.method === 'GET' &&
          httpCall.params.get('sort-by') === 'createdAt' &&
          httpCall.params.get('page') === <any>3 &&
          httpCall.params.get('search') === 'SEARCH TEXT';
      });
    });

    it('maps the response to a GreatThing[]', () => {

    });
  });


});

const sampleResponse = {
  'greatThings': [
    {
      'id': 'GREAT THING ID',
      'text': 'TEXT WITH PICTURE',
      'ownerId': 'OWNER ID',
      'picture': {
        'id': 'PICTURE ID',
        'ownerId': 'OWNER ID',
        'href': 'PICTURE HREF',
        'height': 450,
        'width': 450,
        'format': 'jpeg'
      }
    },
    {
      'id': 'GREAT THING ID 2',
      'text': 'TEXT WITHOUT PICTURE',
      'ownerId': 'OWNER ID'
    }
  ],
  'remainingMatches': 0
};

const mappedTestData = [
  new GreatThing(
    'GREAT THING ID',
    'TEXT WITH PICTURE',
    1,
    1,
    new Picture(
      'PICTURE ID',
      1,
      'PICTURE HREF',
      450,
      450,
      'jpeg'
    )
  )
];