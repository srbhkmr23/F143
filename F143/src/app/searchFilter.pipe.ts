import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filter',
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        
        if (!items) {
            return [];
        }
        if (!field || !value) {
            return items;
        }

        

        return items.filter(singleItem =>{
            const keys = Object.keys(singleItem) || [];
            let exist = false;
            keys.forEach(key => {
                if(singleItem[key].toLowerCase().includes(value.toLowerCase())){
                    exist=true;
                }
            });

            if(exist){
                return singleItem;
            }

            
        }
            
        );
    }
}