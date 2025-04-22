import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsItem, Summary } from '../../../types';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFacebookSquare, faXTwitter} from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-top-news',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './top-news.component.html',
  styleUrl: './top-news.component.css'
})
export class TopNewsComponent {
  @Input() newsData?: NewsItem[];
  modalData: any;
  faFace = faFacebookSquare;
  faTwit = faXTwitter; 

  @ViewChild('contentModal', { static: true }) contentModal!: ElementRef;

  constructor(private modalService: NgbModal) {}

  openModal(data: any) {
    this.modalData = data;
    this.modalService.open(this.contentModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  shareOnTwitter(data: any) {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.headline)}&url=${encodeURIComponent(data.url)}`;
    window.open(url, '_blank');
  }

  shareOnFacebook(data: any) {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
    window.open(url, '_blank');
  }
}
