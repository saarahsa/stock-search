import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Search } from '../../../types';
import { SummaryService } from '../../services/summary.service';
import { Observable, debounceTime, filter, map, of, startWith, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private summaryService: SummaryService) { }

  symbol: FormControl = new FormControl('');
  @Output() searchClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() resetClicked: EventEmitter<void> = new EventEmitter<void>();

  searchLoading: boolean = false;
  options: Search[] = [];
  filteredOptions: Observable<string[]>;
  optionsName = {};
  searchData: Search[] | undefined;

  setSearchValue(value: string) {
    this.symbol.setValue(value);
  }

  onSearchClick() {
    const symbolValue = this.symbol.value;
    this.searchClicked.emit(symbolValue);
    this.setSearchValue(symbolValue);
    // this.fetchSearch(this.symbol.value);
    // this.fetchSearch(symbolValue);
  }

  onReset() {
    this.setSearchValue("");
    this.resetClicked.emit();
  }

  private fetchAutocompleteData(query: string): Observable<string[]> {
    this.searchLoading = true;
    if (!query) {
      return of([]);  // Return an empty array if the query is empty
    }
    return this.summaryService.getAutocomplete(query).pipe(
      map(data => {
        return data["result"]
          .filter((result: any) => result.type === 'Common Stock' && !result.symbol.includes('.'))
          .map((result: any) => {
            this.optionsName[result.symbol] = result.description;
            console.log("filter" + this.filteredOptions)
            console.log("options" + this.optionsName[result.symbol])
            this.searchLoading = false;
            return result.symbol;
          });
      })
    );
  }

  ngOnInit(): void {
    this.filteredOptions = this.symbol.valueChanges.pipe(
      startWith(''),
      filter(value => value !== null && value !== ''), // Ensure value is not null or empty
      debounceTime(300),
      switchMap(value => this.fetchAutocompleteData(value))
    );
  }
}

