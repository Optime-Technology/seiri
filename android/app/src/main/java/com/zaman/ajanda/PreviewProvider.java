package com.zaman.ajanda;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

/** Yalnızca uygulamanın önizleme önbelleğindeki tekil dosyaları salt okunur paylaşır. */
public class PreviewProvider extends ContentProvider {
    @Override public boolean onCreate() { return true; }
    private File resolve(Uri uri) throws FileNotFoundException {
        try {
            String name = uri.getLastPathSegment();
            if (name == null || !name.matches("preview-[a-f0-9-]+\\.(pdf|png|jpg|ics)")) throw new FileNotFoundException();
            File root = new File(getContext().getCacheDir(), "previews").getCanonicalFile();
            File file = new File(root, name).getCanonicalFile();
            if (!file.getParentFile().equals(root) || !file.isFile()) throw new FileNotFoundException();
            return file;
        } catch (Exception error) { throw new FileNotFoundException("Dosya bulunamadı"); }
    }
    @Override public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        if (!"r".equals(mode)) throw new FileNotFoundException("Yalnızca okuma izni var");
        return ParcelFileDescriptor.open(resolve(uri), ParcelFileDescriptor.MODE_READ_ONLY);
    }
    @Override public String getType(Uri uri) {
        String path = uri.getLastPathSegment();
        if (path != null && path.endsWith(".pdf")) return "application/pdf";
        if (path != null && path.endsWith(".ics")) return "text/calendar";
        if (path != null && path.endsWith(".png")) return "image/png";
        return "image/jpeg";
    }
    @Override public Cursor query(Uri uri, String[] projection, String selection, String[] args, String sortOrder) {
        MatrixCursor cursor = new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
        try { File file = resolve(uri); cursor.addRow(new Object[]{file.getName(), file.length()}); } catch (Exception ignored) {}
        return cursor;
    }
    @Override public Uri insert(Uri uri, ContentValues values) { throw new UnsupportedOperationException(); }
    @Override public int delete(Uri uri, String selection, String[] args) { throw new UnsupportedOperationException(); }
    @Override public int update(Uri uri, ContentValues values, String selection, String[] args) { throw new UnsupportedOperationException(); }
}
