import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "./translation.loader";
import { HttpClient } from "@angular/common/http";

@NgModule({
    exports: [ TranslateModule]
})

export class SharedI18nModule {}