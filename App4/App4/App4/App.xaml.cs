using App4.View;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Xamarin.Forms;

namespace App4
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
            //SetMainPage();
            MainPage =new NavigationPage( new App4.MainPage());
        }

        public static void SetMainPage()
        {
            Current.MainPage = new TabbedPage
            {
                Children =
                {

                    new NavigationPage(new MainPage())
                    {
                        Title = "主页",
                        //Icon = Device.OnPlatform<string>("tab_feed.png",null,null)
                    },
                    new NavigationPage(new ExhibitionPage())
                    {
                        Title = "展示页",
                        //Icon = Device.OnPlatform<string>("tab_about.png",null,null)
                    },
                }
            };
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
