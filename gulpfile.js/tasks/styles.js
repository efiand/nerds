'use strict';

const { gulp, plugins, settings } = require(`../store`);
const { styles, common } = settings.tasks;

gulp.task(`styles:compile`, () => {
  return gulp.src(styles.src.compile)
    .pipe(plugins.plumber())
    .pipe(plugins.include())
    .pipe(plugins.sass())
    .pipe(plugins.postcss([
      require(`mqpacker`)(),
      require(`autoprefixer`)()
    ]))
    .pipe(plugins.csscomb())
    .pipe(gulp.dest(styles.dest))
    .pipe(plugins.if(!settings.isDev, plugins.csso()))
    .pipe(plugins.if(!settings.isDev, plugins.rename(common.rename)))
    .pipe(plugins.if(!settings.isDev, gulp.dest(styles.dest)));
});

gulp.task(`styles:lint`, () => {
  return gulp.src(styles.src.lint)
    .pipe(plugins.plumber())
    .pipe(plugins.stylelint(styles.stylelint))
    .pipe(plugins.lintspaces(common.lintspaces))
    .pipe(plugins.lintspaces.reporter());
});

gulp.task(`styles`, gulp.parallel(`styles:compile`, `styles:lint`));
