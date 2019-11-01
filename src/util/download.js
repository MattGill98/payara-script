/**
 * @typedef {import('request').Options} Options
 * @typedef {import('request').RequestCallback} RequestCallback
 */
const { parse } = require('url')
const request = require('request')
const fs = require('fs')
const { basename, resolve } = require('path')

const TIMEOUT = 60000

/**
 * @param {String} url the URL to check the existence of
 */
export const exists = (url, username, password) => new Promise((resolve, reject) => {
  /**
   * @type RequestCallback
   */
  let callback = (error, response, body) => {
    let status = response.statusCode;
    if (status >= 300 || status > 200) {
      reject(status);
    } else {
      resolve(url);
    }
  };
  if (username && password) {
    request.head(url, {
      auth: {
        user: username,
        pass: password
      }
    }, callback);
  } else {
    request.head(url, callback);
  }
});

/**
 * @param {String} url the URL to download
 * @param {String} path the path to download the URL to
 * @param {String} username the username to use for authentication
 * @param {String} password the password to use for authentication
 */
export default function(url, path, username, password) {
  const uri = parse(url)
  if (!path) {
    path = basename(uri.path)
  } else {
    path = resolve(path, basename(uri.path))
  }
  const file = fs.createWriteStream(path)

  return new Promise(function(resolve, reject) {
    let auth = (username && password)? {
      user: username,
      pass: password
    } : undefined;
    request.get(uri.href, {timeout: TIMEOUT, auth: auth}).on('response', function(res) {
      if (res.statusCode > 299) {
        fs.unlink(path, () => {})
        if (res.statusCode == 401) {
          reject(new Error(`Authentication for ${uri.href} failed.`))
        } else {
          reject(new Error(`${uri.href} not found.`))
        }
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
          fs.unlink(path, () => {})
          reject(err)
        })
    })
  })
}