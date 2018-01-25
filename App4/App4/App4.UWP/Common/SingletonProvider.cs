using System;
using System.Collections.Generic;
using System.Text;
using Windows.Storage;
using System.IO;
namespace SQLiteCommon
{
    public class SingletonProvider<T> where T : new()
    {
        public SingletonProvider() { }
        public static T Instance
        {
            get { return SingletonCretor.instance; }
        }
        class SingletonCretor
        {
            static SingletonCretor() { }
            internal static readonly T instance = new T();
        }
    }
}
