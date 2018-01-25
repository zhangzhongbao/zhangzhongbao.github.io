using SQLiteCommon.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;

namespace App4.ViewModel
{
    public class MainViewModel : ObservableObject//BindableObject//: INotifyPropertyChanged
    {
      
        public MainViewModel()
        {
            MockDataStore();
            MessagingCenter.Subscribe<DItem>(this, "Value", (arg1) => {
                if (arg1 != null)
                {
                    database.Execute("DELETE FROM DItem where id=" + arg1.Id);
                    Data = (from cust in database.Table<DItem>()
                            select cust).ToList<DItem>();
                }
            });
        }
       
        
        //实现接口的事件属性
        //public event PropertyChangedEventHandler PropertyChanged;

        public SQLite.SQLiteConnection database;
        public void MockDataStore()
        {
            try
            {
                database =
                    DependencyService.Get<SQLiteCommon.IDatabaseConnection>().DbSqliteConnection();
                Data = (from cust in database.Table<DItem>()
                        select cust).ToList<DItem>();
            }
            catch(Exception ex)
            {

            }
        }
        public ICommand InsertDataCmd
        {
            get
            {
                return new Command((o) =>
                {
                    
                    database.Insert(new DItem() { Id = 1, Text = "aa", Description = "aa" });
                    database.Insert(new DItem() { Id = 1, Text = "bb", Description = "bb" });
                    database.Insert(new DItem() { Id = 1, Text = "cc", Description = "cc" });
                    database.Insert(new DItem() { Id = 1, Text = "dd", Description = "dd" });
                    database.Insert(new DItem() { Id = 1, Text = "ee", Description = "ee" });
                    database.Insert(new DItem() { Id = 1, Text = "ff", Description = "ff" });
                    database.Insert(new DItem() { Id = 1, Text = "gg", Description = "gg" });
                });
            }
        }
        private List<DItem> _Data;
        public List<DItem> Data { get => _Data; set =>  SetProperty(ref _Data, value); }

    //public static readonly BindableProperty DataProperty
    //    = BindableProperty.Create("Data", typeof(List<DItem>), typeof(MainViewModel));
    //public List<DItem> Data
    //{
    //    get =>
    //        (List<DItem>)GetValue(DataProperty);
    //        //Data;
    //    set =>
    //        SetValue(DataProperty, value);
    //    //_Data = value;
    //}
}
}
