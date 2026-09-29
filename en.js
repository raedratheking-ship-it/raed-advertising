/* RAED Advertising — English UI + Default Data */
window.RAED_LANG = 'en';

window.RAED_UI = {
  navHome:"Home",navAbout:"About",navServices:"Services",navGallery:"Gallery",navContact:"Contact",
  waUs:"WhatsApp us",viewWork:"View our work",
  pill1:"Creative direction",pill2:"Production-ready files",pill3:"Fast turnaround",
  chip1:"Social Media",chip2:"Branding",chip3:"Print",chip4:"Web UI",
  aboutLabel:"About",servicesLabel:"Services",servicesTitle:"What we do",
  servicesLead:"Everything your brand needs to look sharp, stay consistent and get noticed.",
  galleryLabel:"Gallery",galleryTitle:"Selected work",
  galleryLead:"A look at recent branding, social, print and advertising projects.",
  allWork:"All work",noImages:"No images in this category yet — check back soon.",
  contactLabel:"Contact",contactTitle:"Let's build your brand",
  chatWA:"Chat on WhatsApp",sendEmail:"Send an email",cv:"Resume",
  tick1:"Strategy-led creative that supports real business goals.",tick2:"Clean, organised files ready for print and digital production.",tick3:"Direct communication and reliable delivery, every project.",
  emailLabel:"Email",waLabel:"WhatsApp",
  adminTitle:"Admin Dashboard",saveChanges:"Save changes",close:"Close",
  signIn:"Sign in",username:"Username",password:"Password",
  tabContent:"Content",tabServices:"Services",tabGallery:"Gallery & Photos",tabContact:"Contact",tabSettings:"Settings",
  heroSection:"Hero",aboutSection:"About",
  eyebrow:"Eyebrow",headline:"Headline",description:"Description",title:"Title",
  text:"Text (blank line = new paragraph)",
  addService:"+ Add service",delete:"Delete",addCategory:"+ New category",categoryName:"Category name",
  servicesCount:"items",uploadCloud:"☁️ Upload to Cloudinary",fromUrl:"🔗 From URL",local:"📁 Local",
  dragDrop:"Drag & drop (local by default)",noImagesCat:"No photos in this category yet.",
  contactTitle2:"Contact",message:"Message",
  cvSection:"📄 Resume (CV)",cvHelp:"Upload a resume (PDF preferred). The Resume button will appear on the contact section automatically.",
  cvUpload:"☁️ Upload resume to Cloudinary",cvUrl:"🔗 Add by URL",cvManual:"Or paste a direct URL",cvSaveUrl:"Save URL",
  cvCurrent:"📄 Current resume — click to preview",cvDelete:"Delete resume",cvNone:"No resume uploaded yet.",
  cloudinarySection:"☁️ Cloudinary",cloudHelp:"Enter your Cloudinary credentials. Make sure the Upload Preset is Signed.",
  cloudName:"Cloud Name",folder:"Folder (optional)",apiKey:"API Key",apiSecret:"API Secret",
  saveBtn:"Save",testBtn:"Test connection",clearBtn:"Clear",
  credsSection:"Admin credentials",updateBtn:"Update",backupSection:"Backup",
  exportJson:"Export JSON",importJson:"Import JSON",resetBtn:"Reset",
  autoPublish:"✅ Auto-publish: every Save changes updates Cloudinary instantly.",noCloud:"⚠️ Enable Cloudinary for auto-publish.",
  addImgUrl:"🔗 Add image from URL",imgUrlOrPage:"Image or page URL",
  preview:"Preview",cancel:"Cancel",add:"Add",
  searching:"Searching for image…",directLink:"✓ Direct image link",extractedFromPage:"✓ Extracted from page",
  notFound:"No image found in this URL",enterUrl:"Please enter a URL",badUrl:"Invalid URL",
  confirmDelete:"Are you sure?",confirmDeleteCategory:"Delete category and all its photos?",
  confirmDeleteResume:"Delete resume?",confirmClearCloud:"Clear Cloudinary settings?",
  confirmReset:"Full reset? All content and settings will be deleted.",
  formTitle:"Send us a message",formSub:"We reply as fast as possible — usually within a few hours.",
  formName:"Your name",formEmail:"Your email",formMsg:"Your message",
  formSend:"Send message",formSending:"Sending…",
  formOk:"✓ Message sent successfully! We will reply soon.",
  formErr:"Something went wrong. Please try WhatsApp or email us directly.",
  formRequired:"Please fill in all fields",
  cmbotSection:"📩 Contact Form → WhatsApp Notifications",
  cmbotHelp:"After configuring CallMeBot, every contact form submission is delivered directly to your WhatsApp — the sender never has to open WhatsApp.",
  cmbotLabel:"CallMeBot API Key",cmbotSave:"Save API Key",cmbotTest:"🧪 Send Test Message",
  cmbotStatus:"✓ Configured — form messages will arrive on WhatsApp silently",
  cmbotNotSet:"⚠️ NOT configured yet — pressing Send will open WhatsApp at the visitor instead. Enter the API key below and click Save.",
  cmbotImportant:"⚠️ After saving the API key below, click Save changes in the top bar to activate it."
};

/* Same bilingual content data */
window.RAED_DATA = {
  "hero":{
    "eyebrow":{"en":"Advertising & Branding Studio","ar":"استوديو إعلان وهوية بصرية"},
    "title":{"en":"We make brands impossible to ignore.","ar":"نجعل علامتك التجارية مستحيلة التجاهل."},
    "sub":{"en":"RAED Advertising is a full-service creative studio crafting bold identities, striking visuals and campaigns that get noticed — on paper, on screen and on the street.","ar":"رائد للإعلان استوديو إبداعي متكامل يصنع هويات جسورة وتصاميم لافتة وحملات لا يمكن تجاهلها — على الورق، على الشاشة، وفي الشارع."}
  },
  "about":{
    "title":{"en":"Ideas that get noticed.","ar":"أفكار تجذب الانتباه."},
    "text":{"en":"RAED Advertising is a creative advertising and design studio helping brands look sharp, stay consistent and stand out in crowded markets.\n\nFrom a single logo to a complete campaign, we combine clear strategy with strong visual craft — social media design, brand identity, print, signage and digital.","ar":"رائد للإعلان هو استوديو إبداعي للإعلان والتصميم يساعد العلامات التجارية على الظهور بشكل احترافي وثابت والتميّز في أسواق مزدحمة.\n\nمن شعار واحد إلى حملة متكاملة، نجمع بين الاستراتيجية الواضحة والحرفة البصرية القوية — تصميم سوشيال ميديا، هوية بصرية، مطبوعات، لوحات إعلانية وحلول رقمية."}
  },
  "services":[
    {"icon":"social","t":{"en":"Social Media Design","ar":"تصميم سوشيال ميديا"},"d":{"en":"Scroll-stopping posts, stories, carousels and campaign visuals built for consistency and reach.","ar":"منشورات وستوريز وكاروسيل وتصاميم حملات توقف التمرير، مبنية للاتساق والوصول."}},
    {"icon":"logo","t":{"en":"Logo Design","ar":"تصميم الشعارات"},"d":{"en":"Distinct, timeless marks designed to work everywhere — from a favicon to a billboard.","ar":"شعارات مميزة وخالدة مصممة لتعمل في كل مكان — من أيقونة صغيرة إلى لوحة إعلانية."}},
    {"icon":"identity","t":{"en":"Visual Identity","ar":"الهوية البصرية"},"d":{"en":"Complete brand systems: colour, typography, layout and guidelines that keep everything on-brand.","ar":"أنظمة هوية متكاملة: ألوان، خطوط، تنسيقات ودلائل تحافظ على اتساق علامتك."}},
    {"icon":"print","t":{"en":"Print Design","ar":"تصميم المطبوعات"},"d":{"en":"Brochures, flyers, business cards, menus and packaging with a premium, print-ready finish.","ar":"بروشورات، فلايرات، كروت، منيوهات وتغليف بلمسة فاخرة جاهزة للطباعة."}},
    {"icon":"banner","t":{"en":"Advertising & Banners","ar":"إعلانات ولوحات"},"d":{"en":"Outdoor, indoor and digital advertising that demands attention day and night.","ar":"إعلانات داخلية وخارجية ورقمية تفرض حضورها ليلاً ونهاراً."}},
    {"icon":"web","t":{"en":"Web UI Design","ar":"تصميم واجهات الويب"},"d":{"en":"Clean, modern interfaces and landing pages designed to look credible and convert visitors.","ar":"واجهات نظيفة وعصرية وصفحات هبوط مصممة لتبدو موثوقة وتحوّل الزوار إلى عملاء."}}
  ],
  "groups":[
    {"id":"g-social","name":{"en":"Social Media","ar":"سوشيال ميديا"},"photos":[]},
    {"id":"g-logo","name":{"en":"Logo Design","ar":"شعارات"},"photos":[]},
    {"id":"g-identity","name":{"en":"Visual Identity","ar":"هوية بصرية"},"photos":[]},
    {"id":"g-print","name":{"en":"Print Design","ar":"مطبوعات"},"photos":[]},
    {"id":"g-ads","name":{"en":"Advertising & Banners","ar":"إعلانات ولوحات"},"photos":[]},
    {"id":"g-web","name":{"en":"Web UI","ar":"واجهات ويب"},"photos":[]}
  ],
  "contact":{
    "email":"raedadvertising65@gmail.com",
    "wa":"967770282271",
    "cv":"",
    "cmbot":"",
    "msg":{"en":"Tell us about your project — we reply fast and give clear pricing.","ar":"أخبرنا عن مشروعك — نرد بسرعة ونقدم تسعيراً واضحاً."}
  }
};