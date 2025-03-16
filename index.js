const fs = require("fs");
const path = require("path");
const NodeID3 = require("node-id3");

const srcDir = "/Users/vikrant/Desktop/MP3/English";
const dstDir = "/Users/vikrant/Desktop/MP3/Converted/English/";
const albumName = "English";

const DEBUG = false;
const SORT_BY_CREATION_DATE = false;
const APPEND_FILE_NUMBER = false;

let fileNumber = 1;

function addFileDetails(file) {
  const filePath = path.join(srcDir, file);
  return {
    file: path.basename(file),
    path: filePath,
    ext: path.extname(file),
    stat: fs.statSync(filePath),
  };
}

function filterMp3Files({ ext }) {
  return Boolean(ext === ".mp3");
}

function sortFilesByCreationDate(fileObjA, fileObjB) {
  const creationTimeOfFileA = new Date(fileObjA.stat.mtime);
  const creationTimeOfFileB = new Date(fileObjB.stat.mtime);
  return creationTimeOfFileA - creationTimeOfFileB;
}

function capitalize(str) {
  return str
    .split(" ")
    .map((word) => `${word.substr(0, 1).toUpperCase()}${word.substr(1)}`)
    .join(" ");
}

function copyFile(fileObj) {
  const newFileName = getNewFileName(fileObj.file, fileObj.ext);
  const dstFile = `${dstDir}${newFileName}`;
  if (!DEBUG) {
    const tags = {};
    tags.trackNumber = fileNumber - 1;
    tags.title = newFileName.substr(0, newFileName.length - 4);
    tags.album = albumName;
    tags.performerInfo = albumName;
    tags.composer = albumName;
    tags.comment = {};
    tags.artist = albumName;
    tags.originalArtist = "";
    tags.conductor = "";
    tags.remixArtist = "";
    tags.partOfSet = "";
    tags.userDefinedText = [];
    tags.commercialFrame = [];
    tags.albumSortOrder = fileNumber - 1;
    tags.performerSortOrder = fileNumber - 1;
    tags.titleSortOrder = fileNumber - 1;
    tags.userDefinedText = "";
    tags.description = "";
    tags.contentGroup = albumName;
    tags.subtitle = "";
    tags.genre = albumName;
    fs.copyFileSync(fileObj.path, dstFile);
    NodeID3.update(tags, dstFile, () => {});
  }
  console.log(newFileName);
}

function getNewFileName(file, ext) {
  const fileName = file
    .replace(ext, "")
    .replace(new RegExp("--", "g"), "-")
    .replace(new RegExp("__", "g"), "-")
    .replace(new RegExp("_", "g"), "-")
    .replace(new RegExp("-", "g"), " ")
    .replace("Songspkred.co", "")
    .replace("I Audio Song Juke Box", "")
    .replace("(DjPunjab.Com)", "")
    .replace("(Pagalworld.pw)", "")
    .replace("(PagalWorld)", "")
    .replace("(PaglaSongs)", "")
    .replace("[PagalWorld.NL]", "")
    .replace("128 kbps sound", "")
    .replace("128 Kbps", "")
    .replace("CKNG", "")
    .replace("(online Audio Convertercom)", "")
    .replace("SikhSangeetCom", "")
    .replace("www.oldisgold.co", "")
    .replace(".in", "")
    .replace("[wwwDJMazaCom]", "")
    .replace("[www.DJMaza.Com]", "")
    .replace("[Songs.PK]", "")
    .replace("[DJMazaInfo]", "")
    .replace("(DjRaagNet)", "")
    .replace("(PagalWorldComCom)", "")
    .replace("[SongsPk.CC]", "")
    .replace("(RaagSong.Com)", "")
    .replace("[DJMaza.Info]", "")
    .replace("[www.Mp3MaD.Com]", "")
    .replace("DownloadMing.SE", "")
    .replace("[IndiaStar.Tk]", "")
    .replace("[DDR]", "")
    .replace("(RaagJatt.com)", "")
    .replace("(Male Version)", "")
    .replace("(KoshalWorld.Com)", "")
    .replace("(Mr Jatt.com)", "")
    .replace("[MyMp3Bhojpuri.In]", "")
    .replace("(DjRaag.Net)", "")
    .replace("[aR]","")
    .replace("(PagalWorldCom.Com)", "")
    .replace("Kbps", "")
    .replace("320kbps", "")
    .replace("(amlijatt)", "")
    .replace(new RegExp("[0-9]", "g"), "")
    .replace("()", "")
    .replace("[]", "")
    .replace(".", "")
    .replace(/  +/g, " ")
    .trim();
  const fileNumberString = `${fileNumber++}`.padStart(3, "0");
  if (APPEND_FILE_NUMBER) {
  return `${fileNumberString} ${capitalize(fileName)}${ext}`;
  } else {
    return `${capitalize(fileName)}${ext}`;
  }
}

async function main() {
  fs.mkdirSync(dstDir, {recursive: true});
  const files = fs
    .readdirSync(srcDir, {recursive: true})
    .map(addFileDetails)
    .filter(filterMp3Files);

    if (SORT_BY_CREATION_DATE) {
      files.sort(sortFilesByCreationDate);
    }

  for (const fileObj of files) {
    copyFile(fileObj);
    if (!DEBUG) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main();
