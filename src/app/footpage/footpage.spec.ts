import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footpage } from './footpage';

describe('Footpage', () => {
  let component: Footpage;
  let fixture: ComponentFixture<Footpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
