import { Component, input, OnDestroy, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatIcon],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnDestroy {
  placeholder = input<string>('Search');
  debounceTimeout = input<number>(500);

  searchControl = new FormControl();
  searchValue = output<string>();

  destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounceTimeout()), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchValue.emit(value);
        this.searchService.setSearchValue(value);
      });
  }

  ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
}
