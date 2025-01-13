'use client';
//Components
import BannersAddForm from '@/lib/ui/screen-components/protected/super-admin/banner/add-form';
import BannersHeader from '@/lib/ui/screen-components/protected/super-admin/banner/view/header/screen-header';
import BannersMain from '@/lib/ui/screen-components/protected/super-admin/banner/view/main';

// State - Render Prop
import BannerStateProvider from '@/lib/states/Banner';

export default function BannerScreen() {
  return (
    <div className="screen-container">
      <BannerStateProvider
        render={({
          banner,
          setBanner,
          isAddBannerVisible,
          setIsAddBannerVisible,
        }) => (
          <>
            <BannersHeader setIsAddBannerVisible={setIsAddBannerVisible} />
            <BannersMain
              setIsAddBannerVisible={setIsAddBannerVisible}
              setBanner={setBanner}
            />
            <BannersAddForm
              banner={banner}
              onHide={() => {
                setIsAddBannerVisible(false);
                setBanner(null);
              }}
              isAddBannerVisible={isAddBannerVisible}
            />
          </>
        )}
      ></BannerStateProvider>
    </div>
  );
}
