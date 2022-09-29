import { WorkerModel } from "./../worker.model";
import { WorkerFormComponent } from "./worker-form.component";

describe("WorkerFormComponent", () => {
  let fixture: WorkerFormComponent;
  let workerServiceMock;
  let dialogServiceMock;
  let loaderServiceMock;

  beforeEach(() => {
    fixture = new WorkerFormComponent(
      workerServiceMock,
      dialogServiceMock,
      loaderServiceMock
    );
  });

  describe("setup component", () => {
    describe("ngOnInit", () => {
      it("should call generateWorkerForm with this.worker", () => {
        // arrange
        const generateWorkerFormSpy = jest.spyOn(fixture, "generateWorkerForm");
        const worker: WorkerModel = {
          id: "worker1",
          name: "worker1",
        } as WorkerModel;

        // act
        fixture.worker = worker;
        fixture.ngOnInit();

        // assert
        expect(generateWorkerFormSpy).toBeCalledWith(worker);
      });
    });
  });
});
