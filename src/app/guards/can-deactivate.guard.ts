import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

type CanDeactivateType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
export interface CanComponentDeactivate {
  canDeactivate: () => CanDeactivateType;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate,
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {

    let url: string = state.url;
    console.log('Url: '+ url);

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
