import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GreatThingsCacheService } from '@src/app/great-things/shared/services/great-things-cache/great-things-cache.service';
import { Subscription } from 'rxjs';
import { SidelogService } from 'sidelog-angular';
import { environment } from '../../../../environments/environment';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { Spied } from '../../../utils/testing/spied.interface';
import { GreatThing } from '../../models/GreatThing.model';
import { Picture } from '../../models/Picture.model';
import { AuthService } from '../auth/auth.service';
import { GreatThingsService } from './great-things.service';

describe('GreatThingsService', () => {
  let service: GreatThingsService;
  let http: HttpTestingController;
  let auth: Spied<AuthService>;
  let logger: Spied<SidelogService>;
  let cache: Spied<GreatThingsCacheService>;
  let testSub: Subscription;
  let retrieveAndCreateUrl: string;

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
        },
        {
          provide: GreatThingsCacheService,
          useFactory: () => cache = spyOnClass(GreatThingsCacheService)
        }
      ]
    });
    service = TestBed.inject(GreatThingsService);
    http = TestBed.inject(HttpTestingController);
    auth.userId.and.returnValue('USER_ID');
    retrieveAndCreateUrl = `${environment.BACKEND_BASE}/users/USER_ID/great-things`;
  });

  afterEach(() => {
    if (testSub) {
      testSub.unsubscribe();
    }

    http.verify();
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
        return httpCall.url === retrieveAndCreateUrl &&
          httpCall.method === 'GET' &&
          httpCall.params.get('sort-by') === 'createdAt' &&
          httpCall.params.get('page') === <any>3 &&
          httpCall.params.get('search') === 'SEARCH TEXT';
      });
      expect(http.verify()).toBeFalsy();
    });

    it('maps the response to a GreatThing[]', (done) => {
      testSub = service.retrieve().subscribe((res) => {
        expect(res).toEqual(mappedTestData());
        done();
      });
      http.expectOne(retrieveAndCreateUrl).flush(sampleResponse());
      expect(http.verify()).toBeFalsy();
    });
  });

  describe('create', () => {
    it('makes a POST request to the correct endpoint', () => {
      testSub = service.create('TEST TEXT').subscribe();
      http.expectOne((req) => {
        return req.url === retrieveAndCreateUrl &&
          req.body.text === 'TEST TEXT' &&
          req.method === 'POST';
      });
      expect(http.verify()).toBeFalsy();
    });

    it('adds the mapped great thing to the cache', (done) => {
      testSub = service.create('TEST').subscribe((mappedRes) => {
        expect(cache.addGreatThings).toHaveBeenCalledWith([mappedRes]);
        done();
      });

      http.expectOne(retrieveAndCreateUrl).flush({
        id: 'ID',
        text: 'TEXT',
        createdAt: 'CREATED AT',
        updatedAt: 'UPDATED AT'
      });
    });
  });

  describe('remove', () => {
    it('makes a DELETE request to the correct endpoint', () => {
      testSub = service.remove('GT_ID').subscribe();
      http.expectOne((req) => {
        return req.url === `${retrieveAndCreateUrl}/GT_ID` &&
          req.method === 'DELETE';
      });
      expect(http.verify()).toBeFalsy();
    });
  });
});

function sampleResponse() {
  return {
    greatThings: [
      {
        id: 'GREAT THING ID',
        text: 'TEXT WITH PICTURE',
        ownerId: 'OWNER ID',
        createdAt: '2020-10-06T00:12:29.590Z',
        updatedAt: '2020-10-06T00:12:29.590Z',
        picture: {
          id: 'PICTURE ID',
          ownerId: 'OWNER ID',
          href: 'PICTURE HREF',
          height: 450,
          width: 450,
          format: 'jpeg',
          createdAt: '2020-10-06T00:12:29.590Z'
        }
      },
      {
        id: 'GREAT THING ID 2',
        text: 'TEXT WITHOUT PICTURE',
        ownerId: 'OWNER ID',
        createdAt: '2020-10-06T00:12:29.590Z',
        updatedAt: '2020-10-06T00:12:29.590Z',
      }
    ],
    remainingMatches: 0
  };
}

function mappedTestData() {
  return [
    new GreatThing(
      'GREAT THING ID',
      'TEXT WITH PICTURE',
      '2020-10-06T00:12:29.590Z',
      '2020-10-06T00:12:29.590Z',
      new Picture(
        'PICTURE ID',
        '2020-10-06T00:12:29.590Z',
        'PICTURE HREF',
        450,
        450,
        'jpeg'
      )
    ),
    new GreatThing(
      'GREAT THING ID 2',
      'TEXT WITHOUT PICTURE',
      '2020-10-06T00:12:29.590Z',
      '2020-10-06T00:12:29.590Z',
      null
    )
  ];
}
