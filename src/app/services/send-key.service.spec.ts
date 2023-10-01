import { TestBed } from '@angular/core/testing';

import { SendKeyService } from './send-key.service';

describe('SendKeyService', () => {
  let service: SendKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
