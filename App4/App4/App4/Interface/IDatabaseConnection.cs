using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SQLiteCommon
{
    public interface IDatabaseConnection
    {
        void Init();
        SQLite.SQLiteConnection DbSqliteConnection();
        string GetHttpClient(string url);
    }
}
