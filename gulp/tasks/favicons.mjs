/**
 * Favicons
 *
 * Создает фавиконки различного разрешения и типа из svg файла
 *
 * Если возникает ошибка у gulp-svg2png
 * Ошибка: DSO support routines:DLFCN_LOAD:could not load the shared library:dso_dlfcn.c:185:filename(libproviders.so):
 * Ввести в терминале: export OPENSSL_CONF=/dev/null
 *
 * Команда для оптимизации svg: npx svgo --multipass ./src/assets/favicons/icon.svg
 *
 * @link https://habr.com/ru/articles/672844/
 */

// Сторонние библиотеки
import { src, dest, watch } from 'gulp' // gulp плагин
import plumber from 'gulp-plumber' // перехватывает ошибки
import notify from 'gulp-notify' // уведомляет об ошибках
import rename from 'gulp-rename' // переименование файла
import ico from 'gulp-to-ico' // png в ico
import merge from 'merge-stream'
import sharp from 'sharp'
import through2 from 'through2'

// Конфиги
import config from '../config.mjs'

const faviconSvg = `${config.src.assets.favicons}/favicon.svg`

const createSvgToPngTransform = size =>
    through2.obj((file, _enc, cb) => {
        if (file.isNull()) {
            cb(null, file)
            return
        }

        if (file.isStream()) {
            cb(new Error('Streaming not supported in faviconBuild'))
            return
        }

        sharp(file.contents)
            .resize(size, size, {
                fit: 'cover',
                withoutEnlargement: true,
            })
            .png()
            .toBuffer()
            .then(buffer => {
                file.contents = buffer
                cb(null, file)
            })
            .catch(error => cb(error))
    })

const withPlumber = () =>
    plumber({
        errorHandler: notify.onError(err => ({
            title: 'Ошибка в задаче faviconBuild',
            sound: false,
            message: err.message,
        })),
    })

// Сборка таска
export const faviconBuild = () => {
    process.env.OPENSSL_CONF = '/dev/null'

    const png512 = src(faviconSvg)
        .pipe(withPlumber())
        .pipe(createSvgToPngTransform(512))
        .pipe(rename('favicon-512.png'))
        .pipe(dest(config.src.assets.favicons))

    const png192 = src(faviconSvg)
        .pipe(withPlumber())
        .pipe(createSvgToPngTransform(192))
        .pipe(rename('favicon-192.png'))
        .pipe(dest(config.src.assets.favicons))

    const png180 = src(faviconSvg)
        .pipe(withPlumber())
        .pipe(createSvgToPngTransform(180))
        .pipe(rename('apple-touch-icon.png'))
        .pipe(dest(config.src.assets.favicons))

    const icoStream = src(faviconSvg)
        .pipe(withPlumber())
        .pipe(createSvgToPngTransform(32))
        .pipe(ico('favicon.ico'))
        .pipe(dest(config.src.assets.favicons))

    return merge(png512, png192, png180, icoStream).pipe(browserSync.stream())
}

// Слежение за изменением файлов
export const faviconWatch = () => watch(faviconSvg, faviconBuild)
