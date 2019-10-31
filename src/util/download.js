const { parse } = require('url')
const http = require('https')
const fs = require('fs')
const { basename, resolve } = require('path')

const TIMEOUT = 60000

/**
 * @param {String} url the URL to check the existence of
 */
export const exists = url => new Promise((resolve, reject) => {
  http.get(url).on('response', ({ statusCode }) => {
    if (statusCode >= 300 || statusCode < 200) {
      reject(statusCode);
    } else {
      resolve(url);
    }
  });
});

/**
 * 
 * @param {String} url the URL to download
 * @param {String} path the path to download the URL to
 */
export default function(url, path) {
  const uri = parse(url)
  if (!path) {
    path = basename(uri.path)
  } else {
    path = resolve(path, basename(uri.path))
  }
  const file = fs.createWriteStream(path)

  return new Promise(function(resolve, reject) {
    const request = http.get(uri.href).on('response', function(res) {
      if (res.statusCode > 299) {
        fs.unlink(path, () => {})
        reject(new Error(`${uri.path} not found.`))
        return
      } 
      const len = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      let percent = 0
      res
        .on('data', function(chunk) {
          file.write(chunk)
          downloaded += chunk.length
          percent = (100.0 * downloaded / len).toFixed(2)
          process.stdout.write(`Downloading ${percent}% ${downloaded} bytes\r`)
        })
        .on('end', function(res) {
          file.end()
          console.log(`${uri.path} downloaded to: ${path}`)
          resolve(path)
        })
        .on('error', function (err) {
          reject(err)
        })
    })
    request.setTimeout(TIMEOUT, function() {
      request.abort()
      reject(new Error(`request timeout after ${TIMEOUT / 1000.0}s`))
    })
  })
}