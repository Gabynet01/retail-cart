import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchService } from '../../services/search/search.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

jest.mock('../../services/search/search.service');

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchServiceMock: jest.Mocked<SearchService>;

  beforeEach(async () => {
    searchServiceMock = new SearchService() as jest.Mocked<SearchService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatIconModule, SearchComponent],
      providers: [{ provide: SearchService, useValue: searchServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Search Input Behavior', () => {
    it('should have a default placeholder', () => {
      expect(component.placeholder()).toBe('Search');
    });

    it('should update search value when input changes', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchValue, 'emit');

      component.searchControl.setValue('test');
      tick(500);
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith('test');
      expect(searchServiceMock.setSearchValue).toHaveBeenCalledWith('test');
    }));
  });

  describe('Component Cleanup', () => {
    it('should clean up subscriptions on destroy', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
