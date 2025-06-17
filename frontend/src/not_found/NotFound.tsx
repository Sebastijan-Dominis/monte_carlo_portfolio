import cat_astronaut from "../assets/cat_astronaut.jpg";

function NotFound() {
  return (
    <div className="relative z-0 text-[#d2d2d2]">
      <h1 className="mt-4 max-w-[80dvw] justify-self-center text-center text-2xl md:mt-8 md:text-3xl lg:mt-10 lg:text-4xl xl:mt-12">
        Whoa, how did you end up here?! That's odd!
      </h1>
      <img
        src={cat_astronaut}
        alt=""
        className="fixed left-1/2 top-1/2 h-auto w-[20dvw] -translate-x-1/2 -translate-y-1/2 rotate-45 xl:w-[15dvw]"
      />
    </div>
  );
}

export default NotFound;
