const AboutPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full">
        <div className="relative w-full h-[400px] md:h-[500px]">
          <img
            className="w-full h-full object-cover"
            alt="A group of friends riding SmartBike motorcycles on a scenic coastal road at sunset."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAuEAinb8lLXj2b5D0dDWD4vmvs5D7W-ISfqmUOeFLn9FOIUdstYQU4XKxZXSPszEdy33twQiqvYdoQV2M362giYR_1673w0TW6FsL5nVoBjACaAhV2-t7eGkue_EHroGZsnTeauORGeTNClBxCuyKETBSkC9V2RvmNR2ipW_QSu6dwJ624jmlXcPXbB_OJE1BzsDW_fzdAHrsOOlTy-lFEuDz1fm1dsxU2JWJe9ir0mYX2IDnU2aaJjPBunIS4sEIRC2v9DYYg0M"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
                Về SmartBike
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-200">
                Kết nối đam mê, chinh phục mọi nẻo đường. Chúng tôi không chỉ cho thuê xe, chúng tôi trao cho bạn sự tự do khám phá.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="flex justify-center w-full px-4 py-16 md:py-24 bg-white dark:bg-gray-800/20">
        <div className="w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#111318] dark:text-white">
                Tầm nhìn & Sứ mệnh
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Tầm nhìn của SmartBike là trở thành nền tảng cho thuê xe máy hàng đầu tại Việt Nam, mang đến giải pháp di chuyển thông minh, tiện lợi và an toàn cho du khách và người dân địa phương. Sứ mệnh của chúng tôi là tạo ra những trải nghiệm du lịch đáng nhớ, giúp mọi người dễ dàng khám phá vẻ đẹp đất nước một cách tự do và linh hoạt nhất.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-background-light dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-primary text-3xl">
                  rocket_launch
                </span>
                <h3 className="mt-3 text-lg font-bold">Tầm nhìn</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Dẫn đầu thị trường cho thuê xe máy thông minh.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background-light dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-primary text-3xl">flag</span>
                <h3 className="mt-3 text-lg font-bold">Sứ mệnh</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Mang lại sự tự do và những hành trình đáng nhớ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="flex justify-center w-full px-4 py-16 md:py-24">
        <div className="w-full max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-[#111318] dark:text-white">
            Giá trị cốt lõi của chúng tôi
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Những nguyên tắc định hình văn hóa và phương châm hoạt động của SmartBike.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-left">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">An toàn là trên hết</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Toàn bộ xe đều được kiểm tra và bảo dưỡng định kỳ nghiêm ngặt, đảm bảo an toàn tuyệt đối trên mọi hành trình.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Khách hàng là trọng tâm</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Chúng tôi lắng nghe và nỗ lực mang đến dịch vụ vượt trội, đáp ứng mọi nhu cầu của khách hàng.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Chất lượng & Minh bạch</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Cung cấp những dòng xe chất lượng cao với mức giá cạnh tranh và hợp đồng rõ ràng, không chi phí ẩn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="flex justify-center w-full px-4 py-16 md:py-24 bg-white dark:bg-gray-800/20">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="rounded-xl overflow-hidden aspect-w-4 aspect-h-3">
              <img
                className="object-cover w-full h-full"
                alt="The first motorcycle that started the SmartBike fleet, displayed in their office."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOs9qXfMkqAHFwyajepxICiTpqApanCObepOGhgLeXT-xJAfzKh0oY6lz0l2-oGLiJFyVt4uce_3UPuSGasJfzEYO78x90QXev_ZnC3a8rJTmgllPeD7LFlfbBkazfKhe7AB5JuNbQrIz7TzRn4XvdoHkW09TeM-CKbMO618G67sOgsvwgCQpImfC9QJBo5NEZMh96oQYhtY3W8yWGdr31-sT-NtqRbctiVj0Yf4uZl-Zgza7X4XlpV2V6-MhN1W0jeAdGggZAR_8"
              />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Hành trình của chúng tôi
              </span>
              <h2 className="mt-2 text-3xl font-bold text-[#111318] dark:text-white">
                Câu chuyện hình thành SmartBike
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                SmartBike ra đời từ niềm đam mê xê dịch và mong muốn chia sẻ vẻ đẹp của Việt Nam với bạn bè quốc tế. Bắt đầu từ một cửa hàng nhỏ với vài chiếc xe, chúng tôi đã không ngừng nỗ lực cải tiến dịch vụ, mở rộng đội xe và ứng dụng công nghệ để mang đến trải nghiệm thuê xe dễ dàng và đáng tin cậy. Đến hôm nay, SmartBike tự hào là người bạn đồng hành của hàng ngàn phượt thủ trên khắp các nẻo đường đất nước.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="flex justify-center w-full px-4 py-16 md:py-24">
        <div className="w-full max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-[#111318] dark:text-white">
            Gặp gỡ đội ngũ của chúng tôi
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Những con người nhiệt huyết đứng sau thành công của SmartBike, luôn sẵn sàng hỗ trợ bạn.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center">
              <img
                className="w-32 h-32 rounded-full object-cover shadow-lg"
                alt="Portrait of Nguyễn Văn An"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtoTyOXGTkQMEs9Y6SIsdrMvDTliREDFWvHhw9kMISAw1DLrbAT3kt7hGfoS-5izObtWvj5A4PvSyHdfBeIOl9kgv4H3bsdcuAg3y5m1MLQ8xOZi8QD1Jxx1JDI9-6UbeTFPpcUFEYutIVUZH71apybXC9xT595EEPStA5b27v7lzW3gt4LsVkObA31MgYxPHBOjGR_nAa4scyvANO_2Abxp4Wfsj95WKMqtOhcW3td1JhFWDsEotea5ttd2N4dq7YfSVxJsW1RQU"
              />
              <h3 className="mt-4 text-lg font-bold text-[#111318] dark:text-white">
                Nguyễn Văn An
              </h3>
              <p className="text-sm text-primary">CEO & Nhà sáng lập</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                Với tình yêu mãnh liệt dành cho những cung đường, anh An là người truyền cảm hứng và lèo lái con thuyền SmartBike.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img
                className="w-32 h-32 rounded-full object-cover shadow-lg"
                alt="Portrait of Trần Thị Bích"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3ZIvxIgA08-w8Nhg-3U6poV9eWIjPZrca-Yl_idLtnpP3NS2qj2QPyQspa9BGDF1mHF4wfSBJ7cjnX7EqPo6IBdnNqderTOPqfFoeUixDeSYxoYi64H8oEMCg4suWQ4a9sNEnP69VIn2HAIqXXGA9SP6QhO-kNffNZzD-d4vwfF1JsjeMEp5TKuWagPer_n2UOzB8ehrXFLTqzoJg2-X3FDCxWPWZs53k1AQLGLTfZVkM101Oxr2J2J5OHhlrVHQHRuVf8vuLtow"
              />
              <h3 className="mt-4 text-lg font-bold text-[#111318] dark:text-white">
                Trần Thị Bích
              </h3>
              <p className="text-sm text-primary">Trưởng phòng Vận hành</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                Chị Bích đảm bảo mọi hoạt động diễn ra trơn tru, từ việc bảo dưỡng xe đến hỗ trợ khách hàng.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img
                className="w-32 h-32 rounded-full object-cover shadow-lg"
                alt="Portrait of Lê Minh Cường"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoKx8kikjDIB9R_4tE8tMIwKWHceGKSe1TZN1oc3dPChN5yZX-OE50JfXrRJvpW6x_SEM0d7UfkfrmnEaqMONE64SIkgcrXggOK9FR5yAnZoOWTgthVll0oekFOyhEmeIXbJCeBKFzdwem3ZIzsjkmNRvz_tP7wX4XvdR9GVsDSRqVTlUA6Uux12Uy6PyZX0v9RCPiBWOrrXXcX1ZDyKRDZVXt1Lp93rQVwQ85nsubeQYhyifu33Zy0P7b84qfFr7yv6SgL5EGB5Q"
              />
              <h3 className="mt-4 text-lg font-bold text-[#111318] dark:text-white">
                Lê Minh Cường
              </h3>
              <p className="text-sm text-primary">Trưởng phòng Kỹ thuật</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 px-4">
                Anh Cường là người đứng sau chất lượng của đội xe, đảm bảo mỗi chiếc xe đều an toàn và mạnh mẽ.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage

