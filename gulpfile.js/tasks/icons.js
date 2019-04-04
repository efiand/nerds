'use strict';
// Сборка фонового векторного спрайта

const { gulp, plugins, settings } = require(`../store`);
const { icons, svgo } = settings.tasks;

gulp.task(`icons`, () => {
  return gulp.src(icons.src)
    .pipe(plugins.imagemin([
      plugins.imagemin.svgo(svgo)
    ]))
    .pipe(gulp.dest(icons.dest.icons))
    .pipe(plugins.svgSprites(icons.options))
    .pipe(gulp.dest(icons.dest.sprite));
});
