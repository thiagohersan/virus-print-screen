PFont mFont;
PVector textPosition;

int URL_LIMIT = 130;
color URL_BACKGROUND_COLOR = #F2F3F5;
color URL_TEXT_COLOR = 64;

ArrayList<PImage> addressBars;
String[] urls;
String mUrl = "https://www.google.com/search?q=soviet+sun+lamp&sxsrf=ALeKk01SkaphK3yagdG1aZ071opqKGIxSw:1585152835755&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiZlMK9grboAhUmD7kGHbitApkQ_AUoAXoECA0QAw&cshid=1585153064277184&biw=1220&bih=706";

void setup() {
  size(1366, 843);
  frameRate(30);
  loadAdressBars();
  loadUrls();
  mFont = createFont("Helvetica", 14);
  textFont(mFont);
  textSize(14);

  if (mUrl.length() > URL_LIMIT) {
    mUrl = mUrl.substring(0, URL_LIMIT) + "...";
  }

  textPosition = new PVector(135, 62);
}

void loadUrls() {
  urls = loadStrings(sketchPath("data/urls.txt"));
}

void loadAdressBars() {
  addressBars = new ArrayList<PImage>();

  File[] files = listFiles(sketchPath("data/address-bars"));
  for (int i = 0; i < files.length; i++) {
    File f = files[i];
    if (f.getName().endsWith("jpg")) {
      addressBars.add(loadImage(sketchPath("data/address-bars/" + f.getName())));
    }
  }
}


void draw() {
  image(addressBars.get((frameCount / 1) % addressBars.size()), 0, 0);

  mUrl = urls[(frameCount / 1) % urls.length];
  if (mUrl.length() > URL_LIMIT) {
    mUrl = mUrl.substring(0, URL_LIMIT) + "...";
  }

  fill(URL_TEXT_COLOR);
  text(mUrl, textPosition.x, textPosition.y);

  int imgIndex = (frameCount / 1) % urls.length;
  PImage mImage = loadImage(sketchPath("data/print-screens/" + imgIndex + ".jpg"));
  image(mImage, 0, 75);

  saveFrame(sketchPath("data/out/######.jpg"));

  if (frameCount > urls.length) exit();
}

int tX = 0, tY = 0;
void keyReleased() {
  if (key == CODED) {
    if (keyCode == UP) {
      tY -= 1;
    } else if (keyCode == DOWN) {
      tY += 1;
    } else if (keyCode == RIGHT) {
      tX += 1;
    } else if (keyCode == LEFT) {
      tX -= 1;
    }
    println(tX + " " + tY);
  }
}
