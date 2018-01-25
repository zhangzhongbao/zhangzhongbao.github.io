using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
//using Windows.Storage;
using SQLite;
using Xamarin.Forms;
using SQLiteCommon;
using SQLiteCommon.Model;

[assembly: Dependency(typeof(DbContext))]
namespace SQLiteCommon
{
    public class DbContext : SingletonProvider<DbContext>, IDatabaseConnection// 
    {
        public string DbFileName = "SQLLiteDb.db";
        public string DbFilePath;
        public void Init()
        {
            using (var db= DbSqliteConnection())
            {
                db.CreateTable<DItem>();
               
            }
        }
        
        public SQLiteConnection DbSqliteConnection()
        {
            int i = 1;
            string dbPath = Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal), DbFileName);

            //IFolder rootFolder = FileSystem.Current.LocalStorage;
            //if (!File.Exists(db))
            //{
            //    SQLiteConnection.CreateFile(dbPath);
            //}
            return new SQLiteConnection(dbPath);
        }
    }
}
